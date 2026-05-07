import React, { useState, useEffect } from "react";
import { Zap, Plus, Trash2, Edit2, Save, X, Image as ImageIcon, BarChart3, HelpCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Product } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { Dialog } from "../../components/ui/Dialog";
import { getCache, setCache } from "@/utils/cache";

export const ProductManager = () => {
  const { session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  // Variant management state
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [variantProductId, setVariantProductId] = useState<string | null>(null);
  const [variantsList, setVariantsList] = useState<any[]>([]);
  const [variantLoading, setVariantLoading] = useState(false);
  const [variantForm, setVariantForm] = useState<any>({ name: '', sku: '', price_cents: 0, attributes: {} });

  const fetchProducts = async () => {
    const cacheKey = "products_list";
    setLoading(true);
    const res = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (res?.data) {
      const data = res.data;
      setCache(cacheKey, data, 30000);
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      const cacheKey = "products_list";
      const cached = getCache(cacheKey);
      if (cached) {
        setProducts(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!isMounted) return;

      if (res?.data) {
        const data = res.data;
        setCache(cacheKey, data, 30000);
        setProducts(data);
      }
      setLoading(false);
    };

    initFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      ...product,
      // Flatten performance results for easier editing
      perf_win_rate: (product as any).performance?.win_rate || 0,
      perf_monthly_return: (product as any).performance?.monthly_return || 0,
      perf_drawdown: (product as any).performance?.drawdown || 0
    } as any);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editingId) return;
    
    setLoading(true);
    
    let dataToSave = { ...editForm };
    const performanceUpdate = {
      win_rate: (dataToSave as any).perf_win_rate || 0,
      monthly_return: (dataToSave as any).perf_monthly_return || 0,
      drawdown: (dataToSave as any).perf_drawdown || 0,
      is_live: true,
      last_updated: new Date().toISOString()
    };

    delete (dataToSave as any).type;
    delete (dataToSave as any).reviews;
    delete (dataToSave as any).variants;
    delete (dataToSave as any).performance;
    delete (dataToSave as any).perf_win_rate;
    delete (dataToSave as any).perf_monthly_return;
    delete (dataToSave as any).perf_drawdown;
    
    // ... JSON parsing logic ...
    const parseJson = (val: any) => {
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch (e) { console.warn("Parse error:", e); return null; }
      }
      return val;
    };

    dataToSave.performance_data = parseJson(dataToSave.performance_data);
    dataToSave.q_and_a = parseJson(dataToSave.q_and_a);
    dataToSave.long_plan_offers = parseJson(dataToSave.long_plan_offers);

    try {
      if (!session) throw new Error("No active session");
      
      // Update Algorithm
      const { error: updateError } = await supabase
        .from('products')
        .update(dataToSave as any)
        .eq('id', editingId);
      
      if (updateError) throw updateError;

      // Update/Insert Performance Snapshot
      const { error: perfError } = await supabase
        .from('algo_performance_snapshots' as any)
        .upsert({
          algo_id: editingId,
          roi_pct: performanceUpdate.monthly_return,
          drawdown_pct: performanceUpdate.drawdown,
          period_start: new Date().toISOString()
        } as any);

      if (perfError) console.error("Performance Update Error:", perfError);
      
      setEditingId(null);
      fetchProducts();
      alert("Institutional Asset Updated Successfully.");
    } catch (error: unknown) {
      const err = error as Error;
      alert("Institutional Data Error: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    try {
      if (!session) throw new Error("No active session");
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete);
      
      if (error) throw new Error(error.message || "Failed to delete product");
      
      fetchProducts();
      setIsDeleteDialogOpen(false);
    } catch (error: unknown) {
      const err = error as Error;
      alert("Error deleting product: " + err.message);
    } finally {
      setDeleteLoading(false);
      setProductToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCreate = async () => {
    const newProduct = {
      name: "New Algorithm",
      description: "Enter description here",
      price: 99,
      category: "Quantitative",
      image_url: "https://picsum.photos/seed/newalgo/800/450",
      strategy_graph_url: "",
      backtesting_result_url: "",
      video_explanation_url: "",
      long_plan_offers: [],
      q_and_a: [],
      terms_and_conditions: "Standard terms apply.",
      performance_data: []
    };

    try {
      if (!session) throw new Error("No active session");
      const { error } = await supabase
        .from('products')
        .insert([newProduct]);
      
      if (error) throw new Error(error.message || "Failed to create product");
      
      fetchProducts();
    } catch (error: unknown) {
      const err = error as Error;
      alert("Error creating product: " + err.message);
    }
  };

  // Variants
  const openVariantModal = async (productId: string) => {
    setVariantProductId(productId);
    setVariantModalOpen(true);
    fetchVariants(productId);
  };

  const fetchVariants = async (productId: string) => {
    setVariantLoading(true);
    try {
      const { data, error } = await supabase.from('product_variants').select('*').eq('product_id', productId);
      if (error) throw error;
      setVariantsList(data || []);
    } catch (err: any) {
      alert('Error fetching variants: ' + (err.message || err));
    } finally {
      setVariantLoading(false);
    }
  };

  const addVariant = async () => {
    if (!variantProductId) return;
    try {
      const { error } = await supabase.from('product_variants').insert([{
        product_id: variantProductId,
        name: variantForm.name,
        price: variantForm.price_cents / 100, // storing as price based on schema
        duration_days: 30 // institutional default
      } as any]);
      if (error) throw error;
      setVariantForm({ name: '', sku: '', price_cents: 0, attributes: {} });
      fetchVariants(variantProductId);
    } catch (err: any) {
      alert('Add variant error: ' + (err.message || err));
    }
  };

  const updateVariant = async (variantId: string, payload: any) => {
    if (!variantProductId) return;
    try {
      const { error } = await supabase.from('product_variants').update(payload).eq('id', variantId);
      if (error) throw error;
      fetchVariants(variantProductId);
    } catch (err: any) {
      alert('Update variant error: ' + (err.message || err));
    }
  };

  const deleteVariant = async (variantId: string) => {
    if (!variantProductId) return;
    if (!confirm('Delete variant?')) return;
    try {
      const { error } = await supabase.from('product_variants').delete().eq('id', variantId);
      if (error) throw error;
      fetchVariants(variantProductId);
    } catch (err: any) {
      alert('Delete variant error: ' + (err.message || err));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-500" />
          Algorithm Marketplace Management
        </h2>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Algo
        </button>
      </div>

      {loading && products.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-8 hover:border-emerald-500/30 transition-all group"
            >
              {editingId === product.id ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="algoName" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Algo Name</label>
                      <input 
                        id="algoName"
                        value={editForm.name || ""} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                      <input 
                        id="category"
                        value={editForm.category || ""} 
                        onChange={e => setEditForm({...editForm, category: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                      <input
                        id="category"
                        value={editForm.category || ""}
                        onChange={e => setEditForm({...editForm, category: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="performanceData" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Performance Data (JSON)</label>
                      <input 
                        id="performanceData"
                        value={typeof editForm.performance_data === 'string' ? editForm.performance_data : JSON.stringify(editForm.performance_data || [])} 
                        onChange={e => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setEditForm({...editForm, performance_data: parsed});
                          } catch (err: unknown) {
      const error = err as Error;
                            // If invalid JSON, just store as string temporarily while typing
                            setEditForm({...editForm, performance_data: e.target.value as any});
                          }
                        }}
                        placeholder='[{"type": "text", "content": "92% Win Rate"}]'
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="liveWinRate" className="block text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Live Win Rate (%)</label>
                      <input 
                        id="liveWinRate"
                        type="number"
                        value={(editForm as any).perf_win_rate || 0} 
                        onChange={e => setEditForm({...editForm, perf_win_rate: Number.parseFloat(e.target.value)} as any)}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="monthlyReturn" className="block text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Monthly Return (%)</label>
                      <input 
                        id="monthlyReturn"
                        type="number"
                        value={(editForm as any).perf_monthly_return || 0} 
                        onChange={e => setEditForm({...editForm, perf_monthly_return: Number.parseFloat(e.target.value)} as any)}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="maxDrawdown" className="block text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Max Drawdown (%)</label>
                      <input 
                        id="maxDrawdown"
                        type="number"
                        value={(editForm as any).perf_drawdown || 0} 
                        onChange={e => setEditForm({...editForm, perf_drawdown: Number.parseFloat(e.target.value)} as any)}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Institutional Description</label>
                    <textarea 
                      id="description"
                      value={editForm.description || ""} 
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                      rows={3}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Price ($/mo)</label>
                      <input 
                        id="price"
                        type="number"
                        value={editForm.price || 0} 
                        onChange={e => setEditForm({...editForm, price: Number.parseFloat(e.target.value)})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="imageUrl" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL</label>
                      <input 
                        id="imageUrl"
                        value={editForm.image_url || ""} 
                        onChange={e => setEditForm({...editForm, image_url: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="strategyGraphUrl" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Strategy Graph URL</label>
                      <input 
                        id="strategyGraphUrl"
                        value={editForm.strategy_graph_url || ""} 
                        onChange={e => setEditForm({...editForm, strategy_graph_url: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="strategyDetails" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Strategy Details (Institutional)</label>
                      <textarea 
                        id="strategyDetails"
                        value={editForm.strategy_details || ""} 
                        onChange={e => setEditForm({...editForm, strategy_details: e.target.value})}
                        rows={4}
                        placeholder="Explain the core logic, indicators, and market conditions..."
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="riskProfile" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Risk Profile</label>
                      <textarea 
                        id="riskProfile"
                        value={editForm.risk_profile || ""} 
                        onChange={e => setEditForm({...editForm, risk_profile: e.target.value})}
                        rows={4}
                        placeholder="Drawdown limits, position sizing, risk per trade..."
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="backtestingResultUrl" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Backtesting Result URL</label>
                      <input 
                        id="backtestingResultUrl"
                        value={editForm.backtesting_result_url || ""} 
                        onChange={e => setEditForm({...editForm, backtesting_result_url: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="videoExplanationUrl" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Video Explanation URL</label>
                      <input 
                        id="videoExplanationUrl"
                        value={editForm.video_explanation_url || ""} 
                        onChange={e => setEditForm({...editForm, video_explanation_url: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="terms" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Terms & Conditions</label>
                    <textarea 
                      id="terms"
                      value={editForm.terms_and_conditions || ""} 
                      onChange={e => setEditForm({...editForm, terms_and_conditions: e.target.value})}
                      rows={3}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="qaData" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Q & A (JSON)</label>
                      <textarea 
                        id="qaData"
                        value={typeof editForm.q_and_a === 'string' ? editForm.q_and_a : JSON.stringify(editForm.q_and_a || [])} 
                        onChange={e => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setEditForm({...editForm, q_and_a: parsed});
                          } catch (err) {
                            console.debug("JSON parsing while typing...", err);
                            setEditForm({...editForm, q_and_a: e.target.value as any});
                          }
                        }}
                        placeholder='[{"question": "How it works?", "answer": "Algorithms..."}]'
                        rows={6}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="longPlanOffers" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Long Plan Offers (JSON)</label>
                      <textarea 
                        id="longPlanOffers"
                        value={typeof editForm.long_plan_offers === 'string' ? editForm.long_plan_offers : JSON.stringify(editForm.long_plan_offers || [])} 
                        onChange={e => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setEditForm({...editForm, long_plan_offers: parsed});
                          } catch (err) {
                            console.debug("JSON parsing while typing...", err);
                            setEditForm({...editForm, long_plan_offers: e.target.value as any});
                          }
                        }}
                        placeholder='[{"months": 12, "discount_percent": 20}]'
                        rows={6}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button 
                      onClick={handleCancel}
                      className="px-6 py-2 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden border border-white/5 bg-black">
                    <img 
                      src={product.image_url || `https://picsum.photos/seed/${product.id}/400/225`} 
                      alt={product.name}
                      className="w-full h-full object-cover opacity-60"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white">{product.name}</h3>
                        <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">{product.category}</div>
                      </div>
                       <div className="flex gap-2">
                         <button 
                           onClick={() => handleEdit(product)}
                           className="p-4 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                         >
                           <Edit2 className="w-5 h-5" />
                         </button>
                         <button 
                           onClick={() => openDeleteDialog(product.id)}
                           className="p-4 bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                         >
                           <Trash2 className="w-5 h-5" />
                         </button>
                         <button
                           onClick={() => openVariantModal(product.id)}
                           className="p-4 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                         >
                           <ImageIcon className="w-5 h-5" />
                         </button>
                       </div>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">{product.description}</p>
                    <div className="flex items-center gap-6">
                      <div className="text-white font-bold">${product.price}<span className="text-gray-500 text-xs font-normal">/mo</span></div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <ImageIcon className="w-3 h-3" />
                        {product.strategy_graph_url ? "Graph Set" : "No Graph"}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <BarChart3 className="w-3 h-3" />
                        {product.backtesting_result_url ? "Backtest Set" : "No Backtest"}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <HelpCircle className="w-3 h-3" />
                        {product.q_and_a?.length || 0} Q&A
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {products.length === 0 && !loading && (
            <div className="text-center py-20 bg-zinc-900/50 border border-white/5 rounded-3xl">
              <p className="text-gray-500">No algorithms found in the database.</p>
            </div>
          )}
        </div>
      )}

      <Dialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteLoading}
        title="Delete Algorithm"
        description="Are you sure you want to delete this algorithm? This will remove it from the marketplace and all associated data will be lost. This action cannot be undone."
        confirmText="Delete Algorithm"
      />

      {/* Variants Dialog */}
      <Dialog isOpen={variantModalOpen} onClose={() => { setVariantModalOpen(false); setVariantProductId(null); }} title="Product Variants">
        <div className="space-y-4">
          {variantLoading ? (
            <div>Loading variants...</div>
          ) : (
            <div className="space-y-3">
              {variantsList.map(v => (
                <div key={v.id} className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold">{v.name}</div>
                    <div className="text-sm text-gray-400">${Number(v.price).toFixed(2)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      const newName = prompt('Variant name', v.name);
                      if (newName !== null) updateVariant(v.id, { name: newName });
                    }} className="px-3 py-1 bg-emerald-600 rounded">Edit</button>
                    <button onClick={() => deleteVariant(v.id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-white/5">
            <h4 className="font-bold">Add Variant</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <input placeholder="Name" value={variantForm.name} onChange={e => setVariantForm({...variantForm, name: e.target.value})} className="bg-black border border-white/10 rounded px-3 py-2" />
              <input placeholder="SKU" value={variantForm.sku} onChange={e => setVariantForm({...variantForm, sku: e.target.value})} className="bg-black border border-white/10 rounded px-3 py-2" />
              <input placeholder="Price (cents)" type="number" value={variantForm.price_cents} onChange={e => setVariantForm({...variantForm, price_cents: Number(e.target.value)})} className="bg-black border border-white/10 rounded px-3 py-2" />
            </div>
            <div className="flex justify-end mt-3">
              <button onClick={addVariant} className="px-4 py-2 bg-emerald-500 rounded">Add Variant</button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
