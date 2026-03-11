import React, { useState, useEffect } from "react";
import { Zap, Plus, Trash2, Edit2, Save, X, Image as ImageIcon, BarChart3, HelpCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Product } from "../../types";

export const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editingId) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('products')
      .update(editForm)
      .eq('id', editingId);
    
    if (error) {
      alert("Error updating product: " + error.message);
    } else {
      setEditingId(null);
      fetchProducts();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this algorithm?")) return;
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      alert("Error deleting product: " + error.message);
    } else {
      fetchProducts();
    }
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
      reviews: [],
      q_and_a: [],
      terms_and_conditions: "Standard terms apply."
    };

    const { error } = await supabase
      .from('products')
      .insert([newProduct]);
    
    if (error) {
      alert("Error creating product: " + error.message);
    } else {
      fetchProducts();
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
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Algo Name</label>
                      <input 
                        value={editForm.name || ""} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                      <input 
                        value={editForm.category || ""} 
                        onChange={e => setEditForm({...editForm, category: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea 
                      value={editForm.description || ""} 
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                      rows={3}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Price ($/mo)</label>
                      <input 
                        type="number"
                        value={editForm.price || 0} 
                        onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL</label>
                      <input 
                        value={editForm.image_url || ""} 
                        onChange={e => setEditForm({...editForm, image_url: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Strategy Graph URL</label>
                      <input 
                        value={editForm.strategy_graph_url || ""} 
                        onChange={e => setEditForm({...editForm, strategy_graph_url: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Strategy Details (Institutional)</label>
                      <textarea 
                        value={editForm.strategy_details || ""} 
                        onChange={e => setEditForm({...editForm, strategy_details: e.target.value})}
                        rows={4}
                        placeholder="Explain the core logic, indicators, and market conditions..."
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Risk Profile</label>
                      <textarea 
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
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Backtesting Result URL</label>
                      <input 
                        value={editForm.backtesting_result_url || ""} 
                        onChange={e => setEditForm({...editForm, backtesting_result_url: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Video Explanation URL</label>
                      <input 
                        value={editForm.video_explanation_url || ""} 
                        onChange={e => setEditForm({...editForm, video_explanation_url: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Terms & Conditions</label>
                    <textarea 
                      value={editForm.terms_and_conditions || ""} 
                      onChange={e => setEditForm({...editForm, terms_and_conditions: e.target.value})}
                      rows={3}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500"
                    />
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
                          className="p-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
};
