import React, { useState, useEffect } from "react";
import {
  TrendingUp, Users, Target, DollarSign, Activity,
  Globe, Clock, ShieldAlert, RefreshCw,
  ArrowUpRight, CreditCard, Video, Star, Zap, Trophy,
  ToggleLeft, ToggleRight
} from "lucide-react";
import { cn } from "../../utils/cn";
import { supabase } from "../../lib/supabase";
import { useFlags } from "../../hooks/useFlags";
import { useQueryClient } from "@tanstack/react-query";

interface LiveStats {
  revenueToday: number;
  revenueMTD: number;
  totalUsers: number;
  totalLeads: number;
  pendingPayments: number;
  upcomingWebinars: number;
  pendingReviews: number;
  systemHealth: "Optimal" | "Warning" | "Critical";
  conversionRate: number;
  activeSubscriptions: number;
}

const INITIAL_STATS: LiveStats = {
  revenueToday: 0,
  revenueMTD: 0,
  totalUsers: 0,
  totalLeads: 0,
  pendingPayments: 0,
  upcomingWebinars: 0,
  pendingReviews: 0,
  systemHealth: "Optimal",
  conversionRate: 0,
  activeSubscriptions: 0,
};

export const CEOPanel = () => {
  const [stats, setStats] = useState<LiveStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const { flags } = useFlags();
  const queryClient = useQueryClient();
  const [localFlags, setLocalFlags] = useState<Record<string, boolean>>({});
  const [updatingFlag, setUpdatingFlag] = useState<string | null>(null);

  // Web Customizer & Sponsorship Desk States
  const [customizerTab, setCustomizerTab] = useState<
    "partners" | "brokers" | "webinar_sponsors" | "blog_allocator" | "webinar_scheduler" | "blog_manager"
  >("partners");
  
  const [partnerBanners, setPartnerBanners] = useState<any[]>([]);
  const [brokersList, setBrokersList] = useState<any[]>([]);
  const [customizerLoading, setCustomizerLoading] = useState(false);
  
  // Partner Form State
  const [partnerForm, setPartnerForm] = useState({
    id: "",
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    placement: "partner",
    priority: 1,
  });
  const [isPartnerEditing, setIsPartnerEditing] = useState(false);

  // Broker Master Registry Form State
  const [brokerForm, setBrokerForm] = useState({
    id: "",
    name: "",
    logo_url: "",
    website_url: "",
    tagline: "",
    description: "",
    is_active: true
  });
  const [isBrokerEditing, setIsBrokerEditing] = useState(false);

  // Webinar Sponsors Linker States
  const [webinarsList, setWebinarsList] = useState<any[]>([]);
  const [selectedWebinarId, setSelectedWebinarId] = useState("");
  const [webinarSponsorsList, setWebinarSponsorsList] = useState<any[]>([]);
  const [selectedBrokerIdForWebinar, setSelectedBrokerIdForWebinar] = useState("");
  const [webinarSponsorTier, setWebinarSponsorTier] = useState("Headline");

  // Blog Sponsor Allocator States
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [selectedBlogId, setSelectedBlogId] = useState("");
  const [selectedBrokerIdForBlog, setSelectedBrokerIdForBlog] = useState("");
  const [blogSponsorConfig, setBlogSponsorConfig] = useState({
    name: "",
    logo_url: "",
    link_url: "",
    tagline: "",
    description: ""
  });

  // Webinar Scheduler Form State
  const [webinarForm, setWebinarForm] = useState({
    id: "",
    title: "",
    description: "",
    date_time: "",
    speaker_name: "",
    speaker_role: "",
    speaker_profile_url: "",
    webinar_image_url: "",
    status: "upcoming",
    type: "free",
    price: 0,
    max_attendees: 500,
    recording_url: "",
    streaming_url: "",
    co_brand_name: "",
    co_brand_logo: "",
    co_brand_banner: "",
    about_content: "",
    learning_points: ["", "", ""],
    q_and_a: [] as any[]
  });
  const [isWebinarFormEditing, setIsWebinarFormEditing] = useState(false);

  // Blog Article Manager Form State
  const [blogForm, setBlogForm] = useState({
    id: "",
    title: "",
    slug: "",
    content: "",
    image_url: "",
    category: "Market Analysis",
    status: "published",
    author_name: "IFX Analyst",
    author_bio: "Expert market analyst at IFX Trades Institutional Desk.",
    bold_headline: "",
    key_insights: ["", "", ""]
  });
  const [isBlogFormEditing, setIsBlogFormEditing] = useState(false);

  const loadCustomizerData = async () => {
    setCustomizerLoading(true);
    try {
      // 1. Fetch Partner banners
      const { data: partnersData } = await supabase
        .from("banners")
        .select("*")
        .eq("placement", "partner")
        .order("priority", { ascending: true });
      setPartnerBanners(partnersData || []);

      // 2. Fetch Master Brokers Registry
      const { data: brokersData } = await supabase
        .from("brokers")
        .select("*")
        .order("name", { ascending: true });
      setBrokersList(brokersData || []);
      if (brokersData && brokersData.length > 0 && !selectedBrokerIdForWebinar) {
        setSelectedBrokerIdForWebinar(brokersData[0].id);
      }

      // 3. Fetch webinars
      const { data: webData } = await supabase
        .from("webinars")
        .select("*")
        .order("date_time", { ascending: false });
      setWebinarsList(webData || []);
      if (webData && webData.length > 0 && !selectedWebinarId) {
        setSelectedWebinarId(webData[0].id);
      }

      // 4. Fetch blogs
      const { data: blgData } = await supabase
        .from("content_posts")
        .select("*")
        .eq("content_type", "blog")
        .order("created_at", { ascending: false });
      setBlogsList(blgData || []);
      if (blgData && blgData.length > 0 && !selectedBlogId) {
        setSelectedBlogId(blgData[0].id);
      }
    } catch (err) {
      console.error("[CEOPanel Customizer] Load error:", err);
    } finally {
      setCustomizerLoading(false);
    }
  };

  const loadWebinarSponsors = async (webinarId: string) => {
    if (!webinarId) return;
    try {
      const { data } = await supabase
        .from("webinar_sponsors")
        .select("*")
        .eq("webinar_id", webinarId);
      setWebinarSponsorsList(data || []);
    } catch (err) {
      console.error("Failed loading webinar sponsors:", err);
    }
  };

  useEffect(() => {
    if (selectedWebinarId) {
      loadWebinarSponsors(selectedWebinarId);
    }
  }, [selectedWebinarId]);

  useEffect(() => {
    if (selectedBlogId && blogsList.length > 0) {
      const blog = blogsList.find(b => b.id === selectedBlogId);
      if (blog && blog.metadata?.sponsor) {
        // Find if sponsor matches any of our brokers to pre-fill selectedBrokerIdForBlog
        const matchedBroker = brokersList.find(br => br.name === blog.metadata.sponsor.name);
        if (matchedBroker) {
          setSelectedBrokerIdForBlog(matchedBroker.id);
        } else {
          setSelectedBrokerIdForBlog("");
        }
        setBlogSponsorConfig({
          name: blog.metadata.sponsor.name || "",
          logo_url: blog.metadata.sponsor.logo_url || "",
          link_url: blog.metadata.sponsor.link_url || "",
          tagline: blog.metadata.sponsor.tagline || "",
          description: blog.metadata.sponsor.description || ""
        });
      } else {
        setSelectedBrokerIdForBlog("");
        setBlogSponsorConfig({
          name: "",
          logo_url: "",
          link_url: "",
          tagline: "",
          description: ""
        });
      }
    }
  }, [selectedBlogId, blogsList, brokersList]);

  useEffect(() => {
    loadCustomizerData();
  }, []);

  // Partner CRUD Handlers
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.title || !partnerForm.image_url) return;
    setCustomizerLoading(true);

    const payload = {
      title: partnerForm.title,
      description: partnerForm.description,
      image_url: partnerForm.image_url,
      link_url: partnerForm.link_url,
      placement: "partner",
      priority: partnerForm.priority,
      is_active: true
    };

    try {
      if (isPartnerEditing && partnerForm.id) {
        const { error } = await supabase
          .from("banners")
          .update(payload)
          .eq("id", partnerForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("banners")
          .insert([payload]);
        if (error) throw error;
      }

      setPartnerForm({
        id: "",
        title: "",
        description: "",
        image_url: "",
        link_url: "",
        placement: "partner",
        priority: partnerForm.priority + 1,
      });
      setIsPartnerEditing(false);
      loadCustomizerData();
    } catch (err) {
      console.error("Save partner failed:", err);
    } finally {
      setCustomizerLoading(false);
    }
  };

  const handleEditPartner = (partner: any) => {
    setPartnerForm({
      id: partner.id,
      title: partner.title || "",
      description: partner.description || "",
      image_url: partner.image_url || "",
      link_url: partner.link_url || "",
      placement: "partner",
      priority: partner.priority || 1,
    });
    setIsPartnerEditing(true);
  };

  const handleDeletePartner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    setCustomizerLoading(true);
    try {
      const { error } = await supabase
        .from("banners")
        .delete()
        .eq("id", id);
      if (error) throw error;
      loadCustomizerData();
    } catch (err) {
      console.error("Delete partner failed:", err);
    } finally {
      setCustomizerLoading(false);
    }
  };

  // Master Broker Registry CRUD Handlers
  const handleSaveBroker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brokerForm.name || !brokerForm.logo_url) return;
    setCustomizerLoading(true);

    const payload = {
      name: brokerForm.name,
      logo_url: brokerForm.logo_url,
      website_url: brokerForm.website_url,
      tagline: brokerForm.tagline,
      description: brokerForm.description,
      is_active: brokerForm.is_active,
      updated_at: new Date().toISOString()
    };

    try {
      if (isBrokerEditing && brokerForm.id) {
        const { error } = await supabase
          .from("brokers")
          .update(payload)
          .eq("id", brokerForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("brokers")
          .insert([payload]);
        if (error) throw error;
      }

      setBrokerForm({
        id: "",
        name: "",
        logo_url: "",
        website_url: "",
        tagline: "",
        description: "",
        is_active: true
      });
      setIsBrokerEditing(false);
      loadCustomizerData();
    } catch (err) {
      console.error("Save broker failed:", err);
    } finally {
      setCustomizerLoading(false);
    }
  };

  const handleEditBroker = (broker: any) => {
    setBrokerForm({
      id: broker.id,
      name: broker.name,
      logo_url: broker.logo_url,
      website_url: broker.website_url || "",
      tagline: broker.tagline || "",
      description: broker.description || "",
      is_active: broker.is_active ?? true
    });
    setIsBrokerEditing(true);
  };

  const handleDeleteBroker = async (id: string) => {
    if (!confirm("Are you sure you want to delete this broker from the master registry? It will not delete linked sponsorships but they will lose connection reference.")) return;
    setCustomizerLoading(true);
    try {
      const { error } = await supabase
        .from("brokers")
        .delete()
        .eq("id", id);
      if (error) throw error;
      loadCustomizerData();
    } catch (err) {
      console.error("Delete broker failed:", err);
    } finally {
      setCustomizerLoading(false);
    }
  };

  // Webinar Sponsor Linker Handlers
  const handleAddWebinarSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWebinarId || !selectedBrokerIdForWebinar) return;
    try {
      const broker = brokersList.find(b => b.id === selectedBrokerIdForWebinar);
      if (!broker) return;

      const { error } = await supabase
        .from("webinar_sponsors")
        .insert([{
          webinar_id: selectedWebinarId,
          name: broker.name,
          tier: webinarSponsorTier,
          logo_url: broker.logo_url,
          website_url: broker.website_url
        }]);
      if (error) throw error;
      
      loadWebinarSponsors(selectedWebinarId);
      
      // Update jsonb sponsor_logos inside webinars table
      const currentWebinar = webinarsList.find(w => w.id === selectedWebinarId);
      if (currentWebinar) {
        const currentSponsorLogos = Array.isArray(currentWebinar.sponsor_logos) ? [...currentWebinar.sponsor_logos] : [];
        const newSponsor = { name: broker.name, logo: broker.logo_url, tier: webinarSponsorTier, url: broker.website_url };
        const updatedSponsorLogos = [...currentSponsorLogos, newSponsor];
        await supabase
          .from("webinars")
          .update({ sponsor_logos: updatedSponsorLogos })
          .eq("id", selectedWebinarId);
      }
    } catch (err) {
      console.error("Failed adding webinar sponsor:", err);
    }
  };

  const handleDeleteWebinarSponsor = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from("webinar_sponsors")
        .delete()
        .eq("id", id);
      if (error) throw error;
      
      loadWebinarSponsors(selectedWebinarId);
      
      // Update jsonb sponsor_logos inside webinars table
      const currentWebinar = webinarsList.find(w => w.id === selectedWebinarId);
      if (currentWebinar && Array.isArray(currentWebinar.sponsor_logos)) {
        const updatedSponsorLogos = currentWebinar.sponsor_logos.filter((s: any) => s.name !== name);
        await supabase
          .from("webinars")
          .update({ sponsor_logos: updatedSponsorLogos })
          .eq("id", selectedWebinarId);
      }
    } catch (err) {
      console.error("Failed deleting webinar sponsor:", err);
    }
  };

  // Blog Sponsor Allocator Handlers
  const handleAssignBlogSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlogId) return;
    setCustomizerLoading(true);
    try {
      const blog = blogsList.find(b => b.id === selectedBlogId);
      if (!blog) return;

      let sponsorObj = null;
      if (selectedBrokerIdForBlog) {
        const broker = brokersList.find(b => b.id === selectedBrokerIdForBlog);
        if (broker) {
          sponsorObj = {
            name: broker.name,
            logo_url: broker.logo_url,
            link_url: broker.website_url,
            tagline: blogSponsorConfig.tagline || broker.tagline || "Official Sponsor",
            description: blogSponsorConfig.description || broker.description || ""
          };
        }
      }

      const updatedMetadata = {
        ...(blog.metadata || {}),
        sponsor: sponsorObj
      };

      if (!sponsorObj) {
        delete updatedMetadata.sponsor;
      }

      const { error } = await supabase
        .from("content_posts")
        .update({ metadata: updatedMetadata })
        .eq("id", selectedBlogId);
      if (error) throw error;

      setBlogsList(prev => prev.map(b => b.id === selectedBlogId ? { ...b, metadata: updatedMetadata } : b));
      alert("Blog post sponsorship updated successfully!");
    } catch (err) {
      console.error("Failed updating blog sponsor:", err);
    } finally {
      setCustomizerLoading(false);
    }
  };

  // Webinar Scheduler Handlers
  const handleSaveWebinar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webinarForm.title || !webinarForm.date_time) return;
    setCustomizerLoading(true);

    const advanced_features = {
      learning_points: webinarForm.learning_points.filter(Boolean),
    };

    const payload = {
      title: webinarForm.title,
      description: webinarForm.description,
      date_time: new Date(webinarForm.date_time).toISOString(),
      speaker_name: webinarForm.speaker_name,
      status: webinarForm.status,
      type: webinarForm.type,
      price: webinarForm.price || 0,
      is_paid: webinarForm.type === "paid",
      max_attendees: webinarForm.max_attendees || 500,
      recording_url: webinarForm.recording_url,
      streaming_url: webinarForm.streaming_url,
      co_brand_name: webinarForm.co_brand_name,
      co_brand_logo: webinarForm.co_brand_logo,
      co_brand_banner: webinarForm.co_brand_banner,
      about_content: webinarForm.about_content,
      speaker_profile_url: webinarForm.speaker_profile_url,
      webinar_image_url: webinarForm.webinar_image_url,
      advanced_features,
    };

    try {
      if (isWebinarFormEditing && webinarForm.id) {
        const { error } = await supabase
          .from("webinars")
          .update(payload)
          .eq("id", webinarForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("webinars")
          .insert([payload]);
        if (error) throw error;
      }

      setWebinarForm({
        id: "",
        title: "",
        description: "",
        date_time: "",
        speaker_name: "",
        speaker_role: "",
        speaker_profile_url: "",
        webinar_image_url: "",
        status: "upcoming",
        type: "free",
        price: 0,
        max_attendees: 500,
        recording_url: "",
        streaming_url: "",
        co_brand_name: "",
        co_brand_logo: "",
        co_brand_banner: "",
        about_content: "",
        learning_points: ["", "", ""],
        q_and_a: []
      });
      setIsWebinarFormEditing(false);
      loadCustomizerData();
    } catch (err) {
      console.error("Failed saving webinar:", err);
    } finally {
      setCustomizerLoading(false);
    }
  };

  const handleEditWebinar = (web: any) => {
    const learningPts = web.advanced_features?.learning_points || ["", "", ""];
    while (learningPts.length < 3) learningPts.push("");

    setWebinarForm({
      id: web.id,
      title: web.title,
      description: web.description || "",
      date_time: web.date_time ? new Date(web.date_time).toISOString().slice(0, 16) : "",
      speaker_name: web.speaker_name || "",
      speaker_role: web.speaker_role || "",
      speaker_profile_url: web.speaker_profile_url || "",
      webinar_image_url: web.webinar_image_url || "",
      status: web.status || "upcoming",
      type: web.type || "free",
      price: web.price || 0,
      max_attendees: web.max_attendees || 500,
      recording_url: web.recording_url || "",
      streaming_url: web.streaming_url || "",
      co_brand_name: web.co_brand_name || "",
      co_brand_logo: web.co_brand_logo || "",
      co_brand_banner: web.co_brand_banner || "",
      about_content: web.about_content || "",
      learning_points: learningPts,
      q_and_a: web.q_and_a || []
    });
    setIsWebinarFormEditing(true);
  };

  const handleDeleteWebinar = async (id: string) => {
    if (!confirm("Are you sure you want to delete this webinar? This will remove all registrations and sponsors.")) return;
    setCustomizerLoading(true);
    try {
      const { error } = await supabase
        .from("webinars")
        .delete()
        .eq("id", id);
      if (error) throw error;
      loadCustomizerData();
    } catch (err) {
      console.error("Failed deleting webinar:", err);
    } finally {
      setCustomizerLoading(false);
    }
  };

  // Blog CRUD Handlers
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content) return;
    setCustomizerLoading(true);

    const slug = blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const metadata = {
      bold_headline: blogForm.bold_headline,
      key_insights: blogForm.key_insights.filter(Boolean),
      author_name: blogForm.author_name,
      author_bio: blogForm.author_bio,
    };

    const payload = {
      title: blogForm.title,
      slug,
      content: blogForm.content,
      body: blogForm.content,
      image_url: blogForm.image_url,
      featured_image: blogForm.image_url,
      category: blogForm.category,
      status: blogForm.status,
      content_type: "blog",
      metadata,
    };

    try {
      if (isBlogFormEditing && blogForm.id) {
        const { error } = await supabase
          .from("content_posts")
          .update(payload)
          .eq("id", blogForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("content_posts")
          .insert([payload]);
        if (error) throw error;
      }

      setBlogForm({
        id: "",
        title: "",
        slug: "",
        content: "",
        image_url: "",
        category: "Market Analysis",
        status: "published",
        author_name: "IFX Analyst",
        author_bio: "Expert market analyst at IFX Trades Institutional Desk.",
        bold_headline: "",
        key_insights: ["", "", ""]
      });
      setIsBlogFormEditing(false);
      loadCustomizerData();
    } catch (err) {
      console.error("Failed saving blog article:", err);
    } finally {
      setCustomizerLoading(false);
    }
  };

  const handleEditBlog = (blog: any) => {
    const meta = blog.metadata || {};
    const keyIns = meta.key_insights || ["", "", ""];
    while (keyIns.length < 3) keyIns.push("");

    setBlogForm({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content || blog.body || "",
      image_url: blog.image_url || blog.featured_image || "",
      category: blog.category || "Market Analysis",
      status: blog.status || "published",
      author_name: meta.author_name || blog.author_name || "IFX Analyst",
      author_bio: meta.author_bio || blog.author_bio || "Expert market analyst at IFX Trades Institutional Desk.",
      bold_headline: meta.bold_headline || blog.bold_headline || "",
      key_insights: keyIns
    });
    setIsBlogFormEditing(true);
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setCustomizerLoading(true);
    try {
      const { error } = await supabase
        .from("content_posts")
        .delete()
        .eq("id", id);
      if (error) throw error;
      loadCustomizerData();
    } catch (err) {
      console.error("Failed deleting blog post:", err);
    } finally {
      setCustomizerLoading(false);
    }
  };

  useEffect(() => {
    if (flags) {
      setLocalFlags({
        urgency_banner_active: !!flags.urgency_banner_active,
        market_ticker_active: !!flags.market_ticker_active,
        institutional_reviews_live: !!flags.institutional_reviews_live,
        show_retail_brokers: !!flags.show_retail_brokers,
        maintenance_mode: !!flags.maintenance_mode,
        webinar_pitch_mode: !!flags.webinar_pitch_mode,
      });
    }
  }, [flags]);

  const handleToggle = async (key: string) => {
    const nextVal = !localFlags[key];
    setUpdatingFlag(key);
    setLocalFlags(prev => ({ ...prev, [key]: nextVal }));

    try {
      const { error } = await supabase
        .from("feature_flags")
        .upsert({ key, enabled: nextVal }, { onConflict: "key" });

      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["flags"] });
    } catch (err) {
      console.error(`[CEOPanel] Failed to toggle flag ${key}:`, err);
      setLocalFlags(prev => ({ ...prev, [key]: !nextVal }));
    } finally {
      setUpdatingFlag(null);
    }
  };

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [
        salesRes,
        usersRes,
        leadsRes,
        paymentsRes,
        webinarsRes,
        reviewsRes,
        subsRes,
        errorsRes,
      ] = await Promise.all([
        supabase.from("sales_tracking").select("sale_amount, created_at"),
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("manual_payment_receipts").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("webinars").select("*", { count: "exact", head: true }).eq("status", "upcoming"),
        supabase.from("reviews").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("system_logs").select("*", { count: "exact", head: true }).eq("severity", "critical"),
      ]);

      const salesData = salesRes.data || [];
      const revenueToday = salesData
        .filter(s => s.created_at >= startOfDay)
        .reduce((sum, s) => sum + (s.sale_amount || 0), 0);
      const revenueMTD = salesData
        .filter(s => s.created_at >= startOfMonth)
        .reduce((sum, s) => sum + (s.sale_amount || 0), 0);

      const totalUsers = usersRes.count ?? 0;
      const totalLeads = leadsRes.count ?? 0;

      const errorCount = errorsRes.count ?? 0;
      let systemHealth: LiveStats["systemHealth"] = "Optimal";
      if (errorCount > 5) {
        systemHealth = "Critical";
      } else if (errorCount > 0) {
        systemHealth = "Warning";
      }

      setStats({
        revenueToday,
        revenueMTD,
        totalUsers,
        totalLeads,
        pendingPayments: paymentsRes.count ?? 0,
        upcomingWebinars: webinarsRes.count ?? 0,
        pendingReviews: reviewsRes.count ?? 0,
        systemHealth,
        conversionRate: totalLeads > 0 ? ((subsRes.count ?? 0) / totalLeads) * 100 : 0,
        activeSubscriptions: subsRes.count ?? 0,
      });
      setLastSync(new Date());
    } catch (err) {
      console.error("[CEOPanel] Stats fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const [regionalStats, setRegionalStats] = useState<any[]>([]);
  const [topAgents, setTopAgents] = useState<any[]>([]);

  const fetchExtendedStats = async () => {
     try {
        // 1. Regional Performance (from reviews)
        const { data: regionalData } = await supabase
          .from('reviews')
          .select('region');
        
        if (regionalData) {
           const counts: Record<string, number> = {};
           regionalData.forEach(r => {
              if (r.region) counts[r.region] = (counts[r.region] || 0) + 1;
           });
           const total = regionalData.length || 1;
           const mapped = Object.entries(counts).map(([region, count]) => ({
              id: region,
              region: region,
              perf: Math.round((count / total) * 100),
              color: region.includes('Asia') ? 'var(--color8)' : 'var(--color39)'
           })).sort((a, b) => b.perf - a.perf);
           setRegionalStats(mapped);
        }

        // 2. Top Agents (from sales_tracking joined with agents)
        const { data: salesData } = await supabase
          .from('sales_tracking')
          .select('sale_amount, agent_id, agents(name, role)');
        
        if (salesData) {
           const agentRevenue: Record<string, { name: string, revenue: number }> = {};
           salesData.forEach((s: any) => {
              const id = s.agent_id;
              const name = s.agents?.name || 'Unknown Agent';
              if (!agentRevenue[id]) agentRevenue[id] = { name, revenue: 0 };
              agentRevenue[id].revenue += (s.sale_amount || 0);
           });
           const top = Object.values(agentRevenue)
             .sort((a, b) => b.revenue - a.revenue)
             .slice(0, 3);
           setTopAgents(top);
        }
     } catch (err) {
        console.error("Extended stats fetch failed:", err);
     }
  };

  useEffect(() => {
    fetchAllStats();
    fetchExtendedStats();
    const interval = setInterval(() => {
       fetchAllStats();
       fetchExtendedStats();
    }, 120000); 
    return () => clearInterval(interval);
  }, []);

  if (loading && !lastSync) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Loading Executive Intelligence...</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    Optimal: "text-emerald-500",
    Warning:  "text-amber-500",
    Critical: "text-red-500",
  }[stats.systemHealth];

  const healthBg = {
    Optimal: "bg-emerald-500/10 border-emerald-500/20",
    Warning:  "bg-amber-500/10 border-amber-500/20",
    Critical: "bg-red-500/10 border-red-500/20",
  }[stats.systemHealth];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">

      {/* Sync Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Executive Dashboard</h2>
          <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mt-1">
            {lastSync ? `Last sync: ${lastSync.toLocaleTimeString()}` : "Syncing..."}
          </p>
        </div>
        <button
          onClick={() => { fetchAllStats(); fetchExtendedStats(); }}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Revenue Hero Block */}
      <div className="bg-gradient-to-br from-[#000103] via-[#050505] to-[#10B981]/5 border border-white/5 p-10 lg:p-16 rounded-[56px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
          <DollarSign className="w-72 h-72 text-emerald-500" />
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10B981]" />
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">Live Revenue Discovery Signal</span>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent)] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 mt-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/60 mb-4">Gross Revenue (MTD)</div>
            <div className="text-7xl lg:text-8xl font-black text-white tracking-tighter tabular-nums">
              ${stats.revenueMTD.toLocaleString()}
            </div>
            <div className="flex items-center gap-3 mt-8">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  {stats.activeSubscriptions} Active Subscriptions
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end lg:items-end gap-6">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-3 lg:text-right">Revenue Today</div>
              <div className="text-5xl font-black text-white tracking-tighter tabular-nums">
                ${stats.revenueToday.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-3 lg:text-right">Conversion Rate</div>
              <div className="text-4xl font-black text-cyan-500 tracking-tighter tabular-nums">
                {stats.conversionRate.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Lead Discovery Footer */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                 <Target className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                 <div className="text-[9px] font-black text-white uppercase tracking-widest leading-none mb-1">Acquisition Velocity</div>
                 <div className="text-[10px] font-mono text-[#58F2B6]">{stats.totalLeads} Potential Alpha Partners</div>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">Platform Integrity</div>
                 <div className={cn("text-[10px] font-black uppercase tracking-widest italic", healthColor)}>{stats.systemHealth} Nodes Operational</div>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center overflow-hidden">
                       <Users size={14} className="text-gray-600" />
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* KPI Grid — Live Supabase Counts */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { id: "users",    label: "Total Users",       value: stats.totalUsers,           icon: Users,       color: "text-white",        bg: "bg-white/5" },
          { id: "leads",    label: "B2B Talent Roster", value: stats.totalLeads,           icon: Target,      color: "text-cyan-400",     bg: "bg-cyan-500/5" },
          { id: "subs",     label: "Active Licences",   value: stats.activeSubscriptions,  icon: Zap,         color: "text-purple-400",   bg: "bg-purple-500/5" },
          { id: "pay",      label: "Escrows Pending",   value: stats.pendingPayments,      icon: CreditCard,  color: stats.pendingPayments > 0 ? "text-amber-400" : "text-gray-600", bg: stats.pendingPayments > 0 ? "bg-amber-500/5" : "bg-white/5" },
          { id: "web",      label: "B2B Briefings",     value: stats.upcomingWebinars,     icon: Video,       color: "text-emerald-400",  bg: "bg-emerald-500/5" },
          { id: "reviews",  label: "Model Audit Queue", value: stats.pendingReviews,       icon: Star,        color: stats.pendingReviews > 0 ? "text-red-400" : "text-gray-600", bg: stats.pendingReviews > 0 ? "bg-red-500/5" : "bg-white/5" },
        ].map(s => (
          <div key={s.id} className={cn("p-6 rounded-[28px] border border-white/5 bg-[var(--raised)] backdrop-blur-xl group hover:border-white/10 transition-all", s.bg)}>
            <s.icon className={cn("w-5 h-5 mb-4 opacity-50 group-hover:opacity-100 transition-opacity", s.color)} />
            <div className={cn("text-3xl font-black tabular-nums tracking-tighter italic", s.color)}>
              {loading ? "—" : s.value.toLocaleString()}
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-gray-700 mt-2 group-hover:text-gray-500 transition-colors">{s.label}</div>
          </div>
        ))}
      </div>

      {/* System Health + Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Regional Performance */}
        <div className="lg:col-span-2 bg-[var(--raised)] border border-white/5 p-10 rounded-[48px] shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Regional Performance</h3>
            <Globe className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-6">
            {regionalStats.length > 0 ? regionalStats.map(r => (
              <div key={r.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black text-gray-300 uppercase tracking-wider">{r.region}</span>
                  <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: r.color }}>{r.perf}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${r.perf}%`, backgroundColor: r.color }}
                  />
                </div>
              </div>
            )) : (
               <div className="py-10 text-center text-[10px] uppercase font-black tracking-widest text-white/10 italic">Awaiting Regional Data Synchronization...</div>
            )}
          </div>
        </div>

        {/* Top Agents Leaderboard */}
        <div className="bg-[var(--raised)] border border-white/5 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-all">
            <Trophy className="w-24 h-24 text-amber-500" />
          </div>
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Top <span className="text-emerald-500">Performers</span></h3>
            <Star className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          
          <div className="space-y-6">
             {topAgents.length > 0 ? (
               topAgents.map((agent, i) => (
                  <div key={agent.name} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 font-black text-[10px] italic">0{i+1}</div>
                        <div>
                           <div className="text-[10px] font-black text-white uppercase tracking-wider">{agent.name}</div>
                           <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none">Senior Growth Agent</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-[11px] font-black text-emerald-500 italic tabular-nums">${agent.revenue.toLocaleString()}</div>
                        <div className="text-[8px] font-bold text-[#58F2B6] uppercase tracking-widest">Performance Sync</div>
                     </div>
                  </div>
                ))
             ) : (
                <div className="py-20 text-center text-[10px] uppercase font-black tracking-widest text-white/10 italic">Personnel Audit in Progress...</div>
             )}
          </div>
          
          <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-all">
             Full Personnel Audit
          </button>
        </div>

        {/* System Health */}
        <div className="bg-[var(--raised)] border border-white/5 p-10 rounded-[48px] shadow-2xl space-y-6">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">System Health</h3>

          <div className={cn("p-6 rounded-3xl border", healthBg)}>
            <div className={cn("flex items-center gap-3 mb-3", healthColor)}>
              <Activity className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Platform Status</span>
            </div>
            <div className={cn("text-2xl font-black uppercase tracking-tight", healthColor)}>
              {stats.systemHealth}
            </div>
            <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-2">
              <Clock className="inline w-3 h-3 mr-1" />
              {lastSync ? lastSync.toLocaleTimeString() : "—"}
            </div>
          </div>

          {stats.pendingPayments > 0 && (
            <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-3 text-amber-400 mb-2">
                <ShieldAlert className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Action Required</span>
              </div>
              <div className="text-lg font-black text-white uppercase tracking-tight">
                {stats.pendingPayments} Pending Payment{stats.pendingPayments > 1 ? "s" : ""}
              </div>
              <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">
                Review & fulfill in Payments tab
              </div>
            </div>
          )}


        </div>
      </div>

      {/* Quick Action Flags */}
      {(stats.pendingPayments > 0 || stats.pendingReviews > 0) && (
        <div className="p-6 bg-black border border-amber-500/20 rounded-3xl">
          <div className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Action Queue
          </div>
          <div className="flex flex-wrap gap-3">
            {stats.pendingPayments > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                  {stats.pendingPayments} payment proof{stats.pendingPayments > 1 ? "s" : ""} waiting
                </span>
              </div>
            )}
            {stats.pendingReviews > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                <Star className="w-3.5 h-3.5 text-red-400" />
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                  {stats.pendingReviews} review{stats.pendingReviews > 1 ? "s" : ""} pending moderation
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Master Command Center Widget */}
      <div className="bg-[var(--raised)] border border-white/5 p-8 rounded-[48px] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
          <Zap className="w-48 h-48 text-emerald-500" />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">
              Master Command <span className="text-emerald-500">Control Room</span>
            </h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-1">
              Zero-Code Live Dashboard remote configurations
            </p>
          </div>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase text-emerald-400 tracking-wider">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10B981]" />
            Postgres Realtime Link Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            {
              key: "urgency_banner_active",
              label: "Urgency Banner",
              desc: "Top countdown promo banner bar.",
              icon: Clock,
              color: "text-amber-500",
              bg: "bg-amber-500/5",
              border: "border-amber-500/20"
            },
            {
              key: "market_ticker_active",
              label: "Live Market Ticker",
              desc: "Dynamic streaming indices banner.",
              icon: Activity,
              color: "text-cyan-500",
              bg: "bg-cyan-500/5",
              border: "border-cyan-500/20"
            },
            {
              key: "institutional_reviews_live",
              label: "Social Proof Desk",
              desc: "Synchronized reviews & feedback.",
              icon: Star,
              color: "text-purple-500",
              bg: "bg-purple-500/5",
              border: "border-purple-500/20"
            },
            {
              key: "show_retail_brokers",
              label: "Retail Brokers",
              desc: "Toggle Dhan, Zerodha, IBKR, Refinitiv.",
              icon: Globe,
              color: "text-emerald-500",
              bg: "bg-emerald-500/5",
              border: "border-emerald-500/20"
            },
            {
              key: "webinar_pitch_mode",
              label: "Webinar Pitch Mode",
              desc: "Toggle holding page vs real workspace.",
              icon: Video,
              color: "text-blue-500",
              bg: "bg-blue-500/5",
              border: "border-blue-500/20"
            },
            {
              key: "maintenance_mode",
              label: "Maintenance Mode",
              desc: "Locks public pages, redirects users.",
              icon: ShieldAlert,
              color: "text-red-500",
              bg: "bg-red-500/5",
              border: "border-red-500/20",
              danger: true
            }
          ].map((item) => {
            const isFlagOn = !!localFlags[item.key];
            const isUpdating = updatingFlag === item.key;
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className={cn(
                  "p-6 rounded-[28px] border bg-white/[0.01] flex flex-col justify-between transition-all duration-300 relative group/card",
                  isFlagOn 
                    ? cn("border-white/10 bg-white/[0.03]", item.danger && "border-red-500/30 bg-red-500/[0.02]") 
                    : "border-white/5 opacity-50 hover:opacity-85 hover:border-white/10"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-2xl bg-white/5", isFlagOn && item.bg)}>
                      <Icon className={cn("w-4 h-4", isFlagOn ? item.color : "text-gray-600")} />
                    </div>
                    {isFlagOn && (
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                        item.danger ? "text-red-400 bg-red-400/10 border-red-400/20" : "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                      )}>
                        Active
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">{item.label}</h4>
                  <p className="text-[10px] text-gray-500 leading-normal">{item.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-black tracking-widest text-gray-600 font-mono uppercase">{item.key}</span>
                  <button
                    onClick={() => handleToggle(item.key)}
                    disabled={isUpdating}
                    className="focus:outline-none"
                    aria-label={`Toggle ${item.label}`}
                  >
                    {isUpdating ? (
                      <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                    ) : isFlagOn ? (
                      <ToggleRight className={cn("w-7 h-7 cursor-pointer transition-colors", item.danger ? "text-red-500" : "text-emerald-500")} />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-gray-700 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sovereign Customizer & Sponsorship Console */}
      <div className="bg-[var(--raised)] border border-white/5 p-8 rounded-[48px] shadow-2xl relative overflow-hidden mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">
              Sovereign Web Customizer <span className="text-[#00A3FF]">&amp; Content Desk</span>
            </h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-1">
              Link ECN Brokers, customize webinar events, publish macro articles, and configure sponsor nodes
            </p>
          </div>
          <button
            onClick={loadCustomizerData}
            disabled={customizerLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", customizerLoading && "animate-spin")} />
            Sync Dashboard
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 mb-6">
          {[
            { id: "partners", label: "Home Partners" },
            { id: "brokers", label: "Master Broker Registry" },
            { id: "webinar_sponsors", label: "Webinar Sponsors" },
            { id: "blog_allocator", label: "Blog Allocator" },
            { id: "webinar_scheduler", label: "Webinar Scheduler" },
            { id: "blog_manager", label: "Blog Publisher" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCustomizerTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                customizerTab === tab.id
                  ? "bg-[#00A3FF]/10 text-[#00A3FF] border-[#00A3FF]/20"
                  : "text-gray-500 hover:text-white bg-white/[0.02] border-transparent"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Customizer Sub-content */}
        <div className="space-y-6">
          {customizerLoading && (
            <div className="py-12 text-center text-[10px] uppercase font-black tracking-widest text-gray-500 animate-pulse">
              Synchronizing and loading database nodes...
            </div>
          )}

          {!customizerLoading && customizerTab === "partners" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
              {/* Partner Form */}
              <form onSubmit={handleSavePartner} className="lg:col-span-5 space-y-4 bg-black/40 border border-white/5 p-6 rounded-3xl">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  {isPartnerEditing ? "Modify" : "Create"} Home Integration Partner
                </h4>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Partner Name *</label>
                  <input
                    type="text"
                    required
                    value={partnerForm.title}
                    onChange={e => setPartnerForm({ ...partnerForm, title: e.target.value })}
                    placeholder="e.g. MetaTrader 5"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Category Label</label>
                  <input
                    type="text"
                    value={partnerForm.description}
                    onChange={e => setPartnerForm({ ...partnerForm, description: e.target.value })}
                    placeholder="e.g. Trading Platform"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Logo Image URL *</label>
                  <input
                    type="url"
                    required
                    value={partnerForm.image_url}
                    onChange={e => setPartnerForm({ ...partnerForm, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Referral Link URL</label>
                  <input
                    type="url"
                    value={partnerForm.link_url}
                    onChange={e => setPartnerForm({ ...partnerForm, link_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Sort Priority</label>
                  <input
                    type="number"
                    value={partnerForm.priority}
                    onChange={e => setPartnerForm({ ...partnerForm, priority: parseInt(e.target.value) || 1 })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#00A3FF] hover:bg-[#008BE3] text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                  >
                    {isPartnerEditing ? "Update Partner" : "Add Partner"}
                  </button>
                  {isPartnerEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsPartnerEditing(false);
                        setPartnerForm({
                          id: "",
                          title: "",
                          description: "",
                          image_url: "",
                          link_url: "",
                          placement: "partner",
                          priority: 1
                        });
                      }}
                      className="px-4 py-3 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Partner List */}
              <div className="lg:col-span-7 space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Active Partners ({partnerBanners.length})
                </h4>
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2 scrollbar-none">
                  {partnerBanners.map(item => (
                    <div key={item.id} className="p-4 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-between gap-4 group">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center p-1.5 shrink-0 overflow-hidden relative">
                          <img src={item.image_url} alt="" className="w-full h-full object-contain rounded" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-white uppercase tracking-tight">{item.title}</div>
                          <div className="text-[10px] text-gray-500">{item.description}</div>
                          <div className="text-[9px] text-zinc-600 font-mono">Priority: {item.priority}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditPartner(item)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase text-white transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePartner(item.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-[10px] font-black uppercase text-red-400 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!customizerLoading && customizerTab === "brokers" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
              {/* Broker Form */}
              <form onSubmit={handleSaveBroker} className="lg:col-span-5 space-y-4 bg-black/40 border border-white/5 p-6 rounded-3xl">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  {isBrokerEditing ? "Modify" : "Register"} Master Sponsor Broker
                </h4>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Broker Name *</label>
                  <input
                    type="text"
                    required
                    value={brokerForm.name}
                    onChange={e => setBrokerForm({ ...brokerForm, name: e.target.value })}
                    placeholder="e.g. Pepperstone"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Logo Image URL (Or local SVG path like /vantage.svg) *</label>
                  <input
                    type="text"
                    required
                    value={brokerForm.logo_url}
                    onChange={e => setBrokerForm({ ...brokerForm, logo_url: e.target.value })}
                    placeholder="/vantage.svg or https://..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">CPA / Referral Website URL</label>
                  <input
                    type="url"
                    value={brokerForm.website_url}
                    onChange={e => setBrokerForm({ ...brokerForm, website_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Ad Tagline / Accent Badge</label>
                  <input
                    type="text"
                    value={brokerForm.tagline}
                    onChange={e => setBrokerForm({ ...brokerForm, tagline: e.target.value })}
                    placeholder="e.g. Raw Spreads Partner"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">CPA Ad Description</label>
                  <textarea
                    rows={2}
                    value={brokerForm.description}
                    onChange={e => setBrokerForm({ ...brokerForm, description: e.target.value })}
                    placeholder="Describe spreads, leverage, or key benefits..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#00A3FF] hover:bg-[#008BE3] text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                  >
                    {isBrokerEditing ? "Update Broker" : "Register Broker"}
                  </button>
                  {isBrokerEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsBrokerEditing(false);
                        setBrokerForm({
                          id: "",
                          name: "",
                          logo_url: "",
                          website_url: "",
                          tagline: "",
                          description: "",
                          is_active: true
                        });
                      }}
                      className="px-4 py-3 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Master Registry List */}
              <div className="lg:col-span-7 space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Registered Broker pool ({brokersList.length})
                </h4>
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2 scrollbar-none">
                  {brokersList.map(item => (
                    <div key={item.id} className="p-4 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-between gap-4 group">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center p-1.5 shrink-0 overflow-hidden relative">
                          <img src={item.logo_url} alt="" className="w-full h-full object-contain rounded" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-white uppercase tracking-tight">{item.name}</div>
                          <div className="text-[10px] text-gray-500 line-clamp-1">{item.tagline || "Broker Sponsor"}</div>
                          <div className="text-[9px] text-[#00A3FF] font-mono truncate max-w-[200px]">{item.website_url}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditBroker(item)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase text-white transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBroker(item.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-[10px] font-black uppercase text-red-400 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!customizerLoading && customizerTab === "webinar_sponsors" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
              {/* Link List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Select Webinar Target</label>
                  <select
                    value={selectedWebinarId}
                    onChange={e => setSelectedWebinarId(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all font-black uppercase"
                  >
                    {webinarsList.map(w => (
                      <option key={w.id} value={w.id}>{w.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Assigned Webinar Sponsors ({webinarSponsorsList.length})
                  </h4>
                  <div className="space-y-2">
                    {webinarSponsorsList.map(s => (
                      <div key={s.id} className="p-4 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                            <img src={s.logo_url} alt="" className="w-full h-full object-contain rounded" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-white uppercase tracking-tight">{s.name}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-[#00A3FF]">{s.tier} Sponsor</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteWebinarSponsor(s.id, s.name)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-[10px] font-black uppercase text-red-400 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {webinarSponsorsList.length === 0 && (
                      <div className="py-12 text-center border border-dashed border-white/5 rounded-2xl text-[10px] text-gray-500 uppercase tracking-widest font-black">
                        No broker sponsors linked to this webinar.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Link Form */}
              <form onSubmit={handleAddWebinarSponsor} className="lg:col-span-5 space-y-4 bg-black/40 border border-white/5 p-6 rounded-3xl">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Link Master Broker</h4>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Select Broker Profile *</label>
                  <select
                    value={selectedBrokerIdForWebinar}
                    onChange={e => setSelectedBrokerIdForWebinar(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all font-bold"
                  >
                    {brokersList.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Sponsorship Tier *</label>
                  <select
                    value={webinarSponsorTier}
                    onChange={e => setWebinarSponsorTier(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all font-bold"
                  >
                    <option value="Headline">Headline Presentation</option>
                    <option value="Partner">Official Platform Partner</option>
                    <option value="Supporter">Supporter</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={brokersList.length === 0}
                  className="w-full py-3 bg-[#00A3FF] hover:bg-[#008BE3] text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                >
                  Link Broker to Webinar
                </button>
              </form>
            </div>
          )}

          {!customizerLoading && customizerTab === "blog_allocator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
              {/* Blog Selection */}
              <div className="lg:col-span-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Select Blog Post Target</label>
                  <select
                    value={selectedBlogId}
                    onChange={e => setSelectedBlogId(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all font-black uppercase"
                  >
                    {blogsList.map(b => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                </div>

                <div className="p-6 bg-zinc-950/80 border border-white/5 rounded-3xl space-y-3 text-xs leading-relaxed">
                  <div className="text-[#00A3FF] font-black uppercase tracking-wider text-[10px]">Sponsorship Protocol</div>
                  <p className="text-gray-400 font-medium">
                    By default, if no broker is allocated, blog posts rotate randomly through active broker sponsors configured under <strong>"Master Broker Registry"</strong>.
                  </p>
                  <p className="text-gray-400 font-medium">
                    Select a broker on the right to lock a specific broker for this article. Select "Rotate Automatically" to reset it.
                  </p>
                </div>
              </div>

              {/* Assignment Form */}
              <form onSubmit={handleAssignBlogSponsor} className="lg:col-span-6 space-y-4 bg-black/40 border border-white/5 p-6 rounded-3xl">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Assign Specific Broker Sponsor</h4>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Select Broker Profile *</label>
                  <select
                    value={selectedBrokerIdForBlog}
                    onChange={e => setSelectedBrokerIdForBlog(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#00A3FF]/50 transition-all font-bold"
                  >
                    <option value="">-- Rotate Automatically (Random active Broker) --</option>
                    {brokersList.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Custom Tagline (Overrides Broker default)</label>
                  <input
                    type="text"
                    value={blogSponsorConfig.tagline}
                    onChange={e => setBlogSponsorConfig({ ...blogSponsorConfig, tagline: e.target.value })}
                    placeholder="e.g. Exclusive CPA Broker Partner"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Custom Ad Description (Overrides Broker default)</label>
                  <textarea
                    rows={2}
                    value={blogSponsorConfig.description}
                    onChange={e => setBlogSponsorConfig({ ...blogSponsorConfig, description: e.target.value })}
                    placeholder="Describe their competitive edge..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00A3FF] hover:bg-[#008BE3] text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                >
                  Save Allocation
                </button>
              </form>
            </div>
          )}

          {!customizerLoading && customizerTab === "webinar_scheduler" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
              {/* Webinar Event Form */}
              <form onSubmit={handleSaveWebinar} className="lg:col-span-6 space-y-4 bg-black/40 border border-white/5 p-6 rounded-3xl">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  {isWebinarFormEditing ? "Modify" : "Schedule"} Webinar Event
                </h4>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Webinar Title *</label>
                  <input
                    type="text"
                    required
                    value={webinarForm.title}
                    onChange={e => setWebinarForm({ ...webinarForm, title: e.target.value })}
                    placeholder="e.g. Gold Algorithmic Masterclass"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-[#00A3FF]/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Date &amp; Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={webinarForm.date_time}
                      onChange={e => setWebinarForm({ ...webinarForm, date_time: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Event Status</label>
                    <select
                      value={webinarForm.status}
                      onChange={e => setWebinarForm({ ...webinarForm, status: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none font-bold"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="past">Past / Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Speaker Name</label>
                    <input
                      type="text"
                      value={webinarForm.speaker_name}
                      onChange={e => setWebinarForm({ ...webinarForm, speaker_name: e.target.value })}
                      placeholder="e.g. Richard Wyckoff"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Speaker Photo URL</label>
                    <input
                      type="text"
                      value={webinarForm.speaker_profile_url}
                      onChange={e => setWebinarForm({ ...webinarForm, speaker_profile_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Event Type</label>
                    <select
                      value={webinarForm.type}
                      onChange={e => setWebinarForm({ ...webinarForm, type: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none font-bold"
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Price (if Paid)</label>
                    <input
                      type="number"
                      value={webinarForm.price}
                      onChange={e => setWebinarForm({ ...webinarForm, price: parseFloat(e.target.value) || 0 })}
                      disabled={webinarForm.type === "free"}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Webinar Cover Image URL</label>
                  <input
                    type="text"
                    value={webinarForm.webinar_image_url}
                    onChange={e => setWebinarForm({ ...webinarForm, webinar_image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Streaming URL (Live Embed link)</label>
                  <input
                    type="text"
                    value={webinarForm.streaming_url}
                    onChange={e => setWebinarForm({ ...webinarForm, streaming_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Recording URL (Past/Archive play link)</label>
                  <input
                    type="text"
                    value={webinarForm.recording_url}
                    onChange={e => setWebinarForm({ ...webinarForm, recording_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Co-Brand Partner Name</label>
                    <input
                      type="text"
                      value={webinarForm.co_brand_name}
                      onChange={e => setWebinarForm({ ...webinarForm, co_brand_name: e.target.value })}
                      placeholder="e.g. Axi Broker"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Co-Brand Logo URL</label>
                    <input
                      type="text"
                      value={webinarForm.co_brand_logo}
                      onChange={e => setWebinarForm({ ...webinarForm, co_brand_logo: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Syllabus Overview / Description</label>
                  <textarea
                    rows={2}
                    value={webinarForm.description}
                    onChange={e => setWebinarForm({ ...webinarForm, description: e.target.value })}
                    placeholder="Brief syllabus / outcome statement..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Detail Syllabus Syllabus (Markdown / Full content)</label>
                  <textarea
                    rows={3}
                    value={webinarForm.about_content}
                    onChange={e => setWebinarForm({ ...webinarForm, about_content: e.target.value })}
                    placeholder="Outline of modules and strategies taught..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block">3 Core Learning Syllabus Taught</label>
                  {webinarForm.learning_points.map((pt, i) => (
                    <input
                      key={i}
                      type="text"
                      value={pt}
                      onChange={e => {
                        const next = [...webinarForm.learning_points];
                        next[i] = e.target.value;
                        setWebinarForm({ ...webinarForm, learning_points: next });
                      }}
                      placeholder={`Learning Point 0${i + 1}`}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                    />
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#00A3FF] hover:bg-[#008BE3] text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                  >
                    {isWebinarFormEditing ? "Update Webinar" : "Create Masterclass"}
                  </button>
                  {isWebinarFormEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsWebinarFormEditing(false);
                        setWebinarForm({
                          id: "",
                          title: "",
                          description: "",
                          date_time: "",
                          speaker_name: "",
                          speaker_role: "",
                          speaker_profile_url: "",
                          webinar_image_url: "",
                          status: "upcoming",
                          type: "free",
                          price: 0,
                          max_attendees: 500,
                          recording_url: "",
                          streaming_url: "",
                          co_brand_name: "",
                          co_brand_logo: "",
                          co_brand_banner: "",
                          about_content: "",
                          learning_points: ["", "", ""],
                          q_and_a: []
                        });
                      }}
                      className="px-4 py-3 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Webinar Event list */}
              <div className="lg:col-span-6 space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Upcoming &amp; Past Webinars ({webinarsList.length})
                </h4>
                <div className="space-y-2 max-h-[750px] overflow-y-auto pr-2 scrollbar-none">
                  {webinarsList.map(item => (
                    <div key={item.id} className="p-4 bg-zinc-900 border border-white/5 rounded-2xl flex flex-col gap-3 group">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border",
                          item.status === "live" ? "text-red-400 bg-red-400/10 border-red-400/20" :
                          item.status === "past" ? "text-gray-400 bg-zinc-800 border-zinc-700" :
                          "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                        )}>
                          {item.status}
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono">{new Date(item.date_time).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <div className="text-xs font-black text-white uppercase tracking-tight">{item.title}</div>
                        <div className="text-[10px] text-gray-500 mt-1">Speaker: {item.speaker_name || "N/A"}</div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleEditWebinar(item)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase text-white transition-all"
                        >
                          Edit Details
                        </button>
                        <button
                          onClick={() => handleDeleteWebinar(item.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-[10px] font-black uppercase text-red-400 transition-all"
                        >
                          Delete Event
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!customizerLoading && customizerTab === "blog_manager" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
              {/* Blog Article Form */}
              <form onSubmit={handleSaveBlog} className="lg:col-span-6 space-y-4 bg-black/40 border border-white/5 p-6 rounded-3xl">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  {isBlogFormEditing ? "Modify" : "Write"} Blog Post
                </h4>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Post Title *</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="e.g. Master trading psychology"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Custom Slug (Auto-generated if empty)</label>
                    <input
                      type="text"
                      value={blogForm.slug}
                      onChange={e => setBlogForm({ ...blogForm, slug: e.target.value })}
                      placeholder="e.g. master-trading-psychology"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Category</label>
                    <input
                      type="text"
                      value={blogForm.category}
                      onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}
                      placeholder="e.g. Market Analysis"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Featured Image URL</label>
                    <input
                      type="text"
                      value={blogForm.image_url}
                      onChange={e => setBlogForm({ ...blogForm, image_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Publishing Status</label>
                    <select
                      value={blogForm.status}
                      onChange={e => setBlogForm({ ...blogForm, status: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none font-bold"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Bold Introduction / Subtitle</label>
                  <input
                    type="text"
                    value={blogForm.bold_headline}
                    onChange={e => setBlogForm({ ...blogForm, bold_headline: e.target.value })}
                    placeholder="Brief description that anchors B2B allocation..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Body Content (HTML/Markdown supported) *</label>
                  <textarea
                    rows={8}
                    required
                    value={blogForm.content}
                    onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                    placeholder="Write detailed institutional analysis..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Author Name</label>
                    <input
                      type="text"
                      value={blogForm.author_name}
                      onChange={e => setBlogForm({ ...blogForm, author_name: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Author Bio</label>
                    <input
                      type="text"
                      value={blogForm.author_bio}
                      onChange={e => setBlogForm({ ...blogForm, author_bio: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block">3 Key Insights Summary</label>
                  {blogForm.key_insights.map((ins, i) => (
                    <input
                      key={i}
                      type="text"
                      value={ins}
                      onChange={e => {
                        const next = [...blogForm.key_insights];
                        next[i] = e.target.value;
                        setBlogForm({ ...blogForm, key_insights: next });
                      }}
                      placeholder={`Key Insight 0${i + 1}`}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none"
                    />
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#00A3FF] hover:bg-[#008BE3] text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                  >
                    {isBlogFormEditing ? "Update Article" : "Publish Article"}
                  </button>
                  {isBlogFormEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsBlogFormEditing(false);
                        setBlogForm({
                          id: "",
                          title: "",
                          slug: "",
                          content: "",
                          image_url: "",
                          category: "Market Analysis",
                          status: "published",
                          author_name: "IFX Analyst",
                          author_bio: "Expert market analyst at IFX Trades Institutional Desk.",
                          bold_headline: "",
                          key_insights: ["", "", ""]
                        });
                      }}
                      className="px-4 py-3 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Blog list */}
              <div className="lg:col-span-6 space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Published &amp; Draft Articles ({blogsList.length})
                </h4>
                <div className="space-y-2 max-h-[750px] overflow-y-auto pr-2 scrollbar-none">
                  {blogsList.map(item => (
                    <div key={item.id} className="p-4 bg-zinc-900 border border-white/5 rounded-2xl flex flex-col gap-3 group">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border",
                          item.status === "published" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-gray-400 bg-zinc-800 border-zinc-700"
                        )}>
                          {item.status}
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <div className="text-xs font-black text-white uppercase tracking-tight">{item.title}</div>
                        <div className="text-[10px] text-gray-500 mt-1">Slug: {item.slug}</div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleEditBlog(item)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase text-white transition-all"
                        >
                          Edit Post
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(item.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-[10px] font-black uppercase text-red-400 transition-all"
                        >
                          Delete Post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
