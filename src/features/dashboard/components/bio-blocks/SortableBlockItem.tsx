import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, Link as LinkIcon, ShoppingBag, Type, Play, Eye, EyeOff, Timer, Mail } from 'lucide-react';
import type { BioBlock } from '@/entities/bio/api';

interface SortableBlockItemProps {
  id: string;
  block: BioBlock;
  onEdit: (block: BioBlock) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export const SortableBlockItem: React.FC<SortableBlockItemProps> = ({ id, block, onEdit, onDelete, onToggleVisibility }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const getIcon = () => {
    switch (block.type) {
      case 'LINK': return <LinkIcon className="w-4 h-4 text-blue-400" />;
      case 'PRODUCT': return <ShoppingBag className="w-4 h-4 text-brand-orange" />;
      case 'TEXT': return <Type className="w-4 h-4 text-green-400" />;
      case 'YOUTUBE': return <Play className="w-4 h-4 text-red-500" />;
      case 'COUNTDOWN': return <Timer className="w-4 h-4 text-purple-400" />;
      case 'LEAD_FORM': return <Mail className="w-4 h-4 text-teal-400" />;
      default: return <LinkIcon className="w-4 h-4" />;
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center gap-3 bg-brand-card/40 backdrop-blur-sm p-3 rounded-xl border mb-3 transition-colors ${
        isDragging ? 'border-brand-orange shadow-lg shadow-brand-orange/20 opacity-90' : 'border-border hover:border-border/80'
      } ${!block.is_visible ? 'opacity-50' : ''}`}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none p-1.5"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Icon */}
      <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center border border-border flex-shrink-0">
        {getIcon()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-foreground truncate">
          {block.title || (block.type === 'PRODUCT' ? 'Khối Sản phẩm' : 'Khối Liên kết')}
        </h4>
        <p className="text-[10px] text-muted-foreground truncate">
          {block.type === 'PRODUCT' ? `Product ID: ${block.product_id}` : block.url || block.content || '...'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleVisibility(id); }}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          title={block.is_visible ? "Ẩn khối" : "Hiện khối"}
        >
          {block.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(block); }}
          className="p-1.5 text-muted-foreground hover:text-brand-orange transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(id); }}
          className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
