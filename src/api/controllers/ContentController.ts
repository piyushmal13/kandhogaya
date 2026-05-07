import { supabaseAdmin as supabase } from '@/lib/supabase';
import type { Request, Response } from 'express';

/**
 * Base controller utility for authentication validation
 */
const validateAuth = (req: Request) => {
  const role = req.headers.get('x-verified-role');
  const userId = req.headers.get('x-user-id');
  if (!role || !userId) return null;
  return { userId, role };
};

/**
 * ContentController — Institutional CMS & Webinar Management
 * Routes:
 *   GET    /api/content              - List published blog posts
 *   GET    /api/content/:slug        - Single post by slug
 *   GET    /api/webinars             - List webinars with filtering
 *   POST   /api/webinars/register    - Register user for webinar
 *   GET    /api/products             - Marketplace listings
 */
export const ContentController = {
  /**
   * GET /api/content
   * Query params: ?page=1&limit=20&category=xyz
   */
  getPosts: async (req: Request, res: Response) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
      const category = url.searchParams.get('category');
      const offset = (page - 1) * limit;

      let query = supabase
        .from('content_posts')
        .select(`
          *,
          author:users!author_id(full_name, avatar_url, role),
          category:content_categories!category_id(name, slug)
        `, { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (category) {
        query = query.eq('category.slug', category);
      }

      const { data, error, count } = await query
        .range(offset, offset + limit - 1);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({
        posts: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Content retrieval failed' });
    }
  },

  /**
   * GET /api/content/:slug
   */
  getPostBySlug: async (req: Request, res: Response) => {
    const { slug } = req.params;
    
    try {
      const { data, error } = await supabase
        .from('content_posts')
        .select(`
          *,
          author:users!author_id(full_name, avatar_url, role),
          category:content_categories!category_id(name, slug),
          seo:content_seo!posts_seo_id(meta_title, meta_description, og_image)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Increment view count asynchronously
      supabase.rpc('increment_post_views', { post_id: data.id }).catch(() => {});

      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Content retrieval failed' });
    }
  },

  /**
   * GET /api/webinars
   * Query params: ?status=upcoming&limit=20
   */
  getWebinars: async (req: Request, res: Response) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const status = url.searchParams.get('status') || 'upcoming';
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);

      const { data, error } = await supabase
        .from('webinars')
        .select(`
          *,
          sponsors:webinar_sponsors(*),
          _count:registrations(count)
        `)
        .eq('status', status)
        .order('date_time', { ascending: status === 'upcoming' })
        .limit(limit);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ webinars: data || [] });
    } catch (err: any) {
      res.status(500).json({ error: 'Webinar retrieval failed' });
    }
  },

  /**
   * POST /api/webinars/register
   * Body: { webinarId: string }
   */
  registerWebinar: async (req: Request, res: Response) => {
    const auth = validateAuth(req);
    if (!auth) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { webinarId, paymentIntentId } = req.body;

    if (!webinarId) {
      return res.status(400).json({ error: 'Webinar ID required' });
    }

    try {
      // Check if already registered
      const { data: existing } = await supabase
        .from('webinar_registrations')
        .select('id')
        .eq('webinar_id', webinarId)
        .eq('user_id', auth.userId)
        .single();

      if (existing) {
        return res.status(409).json({ error: 'Already registered for this webinar' });
      }

      // Check capacity
      const { data: webinar } = await supabase
        .from('webinars')
        .select('max_attendees, registration_count, is_paid, price')
        .eq('id', webinarId)
        .single();

      if (!webinar) {
        return res.status(404).json({ error: 'Webinar not found' });
      }

      if (webinar.registration_count >= webinar.max_attendees) {
        return res.status(409).json({ error: 'Webinar is at capacity' });
      }

      // Handle paid webinars
      let paymentStatus = 'free';
      if (webinar.is_paid && webinar.price > 0) {
        if (!paymentIntentId) {
          return res.status(402).json({ 
            error: 'Payment required', 
            required: webinar.price,
            currency: 'USD'
          });
        }
        // Verify payment with Stripe/Razorpay (implement based on payment provider)
        paymentStatus = 'completed';
      }

      // Create registration
      const { error: insertError } = await supabase
        .from('webinar_registrations')
        .insert({
          webinar_id: webinarId,
          user_id: auth.userId,
          email: req.user?.email,
          payment_status: paymentStatus,
          registration_date: new Date().toISOString(),
          payment_intent_id: paymentIntentId
        });

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }

      // Real-time trigger will update registration_count automatically

      res.status(201).json({ 
        success: true, 
        message: 'Registration confirmed',
        webinar: webinar
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Registration failed' });
    }
  },

  /**
   * GET /api/products
   * Query params: ?category=algorithm&limit=50&offset=0
   */
  getProducts: async (req: Request, res: Response) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const category = url.searchParams.get('category');
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const includeInactive = url.searchParams.get('all') === 'true';

      let query = supabase
        .from('products')
        .select(`
          *,
          performance:algo_performance_snapshots(*),
          images:product_images(is_primary, storage_path, alt_text),
          variants:product_variants(*)
        `)
        .order('created_at', { ascending: false });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error, count } = await query
        .range(offset, offset + limit - 1);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Transform data for frontend consumption
      const transformed = (data || []).map((product: any) => ({
        ...product,
        image_url: product.images?.find((img: any) => img.is_primary)?.storage_path || product.image_url,
        performance: product.performance?.[0] || null
      }));

      res.json({
        products: transformed,
        total: count || 0,
        pagination: { limit, offset, total: count || 0 }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Product retrieval failed' });
    }
  },

  /**
   * GET /api/products/:id
   */
  getProductById: async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          performance:algo_performance_snapshots(*),
          images:product_images(*),
          variants:product_variants(*),
          reviews:reviews(*),
          bots:algo_bots(*)
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Product retrieval failed' });
    }
  }
};
