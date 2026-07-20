import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { BioBlock, BioBlockType } from '@/entities/bio/api';
import type { Product } from '@/entities/product/api';
import { SortableBlockItem } from './SortableBlockItem';
import { Button } from '@/shared/ui/Button';

interface BioBlocksEditorProps {
  blocks: BioBlock[];
  products?: Product[];
  onChange: (blocks: BioBlock[]) => void;
}

export const BioBlocksEditor: React.FC<BioBlocksEditorProps> = ({ blocks, products = [], onChange }) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Yêu cầu kéo 5px trước khi kích hoạt (để không chặn scroll/click)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      onChange(newBlocks);
    }
  };

  const handleAddBlock = (type: BioBlockType) => {
    let defaultTitle = 'Link mới';
    if (type === 'PRODUCT') defaultTitle = 'Sản phẩm mới';
    if (type === 'COUNTDOWN') defaultTitle = 'Đồng hồ đếm ngược';
    if (type === 'LEAD_FORM') defaultTitle = 'Thu thập Email';

    const newBlock: BioBlock = {
      id: crypto.randomUUID(),
      type,
      title: defaultTitle,
      is_visible: true,
      url: type === 'LINK' ? 'https://' : undefined,
      discount_text: type === 'COUNTDOWN' ? 'Giảm giá 50% chỉ còn:' : undefined,
      expires_at: type === 'COUNTDOWN' ? new Date(Date.now() + 86400000).toISOString() : undefined,
      button_text: type === 'LEAD_FORM' ? 'Đăng ký ngay' : undefined,
    };
    onChange([...blocks, newBlock]);
    setIsEditing(newBlock.id);
  };

  const handleDeleteBlock = (id: string) => {
    if (confirm('Bạn có chắc muốn xoá khối này không?')) {
      onChange(blocks.filter(b => b.id !== id));
    }
  };

  const handleToggleVisibility = (id: string) => {
    onChange(blocks.map(b => b.id === id ? { ...b, is_visible: !b.is_visible } : b));
  };

  return (
    <div className="space-y-4">
      {/* Editor Modal/Form here if isEditing */}
      {isEditing && (
        <div className="p-4 bg-brand-card rounded-xl border border-border mb-4">
          <h4 className="text-sm font-bold mb-3">Chỉnh sửa Khối</h4>
          <div className="space-y-3">
             <input 
               className="w-full px-3 py-2 text-xs rounded-lg glass-input"
               placeholder="Tiêu đề"
               value={blocks.find(b => b.id === isEditing)?.title || ''}
               onChange={(e) => onChange(blocks.map(b => b.id === isEditing ? { ...b, title: e.target.value } : b))}
             />
             {blocks.find(b => b.id === isEditing)?.type === 'LINK' && (
               <input 
                 className="w-full px-3 py-2 text-xs rounded-lg glass-input"
                 placeholder="URL (https://...)"
                 value={blocks.find(b => b.id === isEditing)?.url || ''}
                 onChange={(e) => onChange(blocks.map(b => b.id === isEditing ? { ...b, url: e.target.value } : b))}
               />
             )}
             {blocks.find(b => b.id === isEditing)?.type === 'PRODUCT' && (
               <select 
                 className="w-full px-3 py-2 text-xs rounded-lg glass-input text-foreground bg-background"
                 value={blocks.find(b => b.id === isEditing)?.product_id || ''}
                 onChange={(e) => onChange(blocks.map(b => b.id === isEditing ? { ...b, product_id: e.target.value } : b))}
               >
                 <option value="">-- Chọn sản phẩm --</option>
                 {products.map(p => (
                   <option key={p.id} value={p.id}>{p.name}</option>
                 ))}
               </select>
             )}
             {blocks.find(b => b.id === isEditing)?.type === 'COUNTDOWN' && (
               <>
                 <input 
                   className="w-full px-3 py-2 text-xs rounded-lg glass-input"
                   placeholder="Dòng giới thiệu (VD: Giảm 50% chỉ còn:)"
                   value={blocks.find(b => b.id === isEditing)?.discount_text || ''}
                   onChange={(e) => onChange(blocks.map(b => b.id === isEditing ? { ...b, discount_text: e.target.value } : b))}
                 />
                 <input 
                   type="datetime-local"
                   className="w-full px-3 py-2 text-xs rounded-lg glass-input"
                   value={blocks.find(b => b.id === isEditing)?.expires_at?.slice(0, 16) || ''}
                   onChange={(e) => onChange(blocks.map(b => b.id === isEditing ? { ...b, expires_at: new Date(e.target.value).toISOString() } : b))}
                 />
               </>
             )}
             {blocks.find(b => b.id === isEditing)?.type === 'LEAD_FORM' && (
               <>
                 <input 
                   className="w-full px-3 py-2 text-xs rounded-lg glass-input"
                   placeholder="Chữ trên nút (VD: Nhận Ebook)"
                   value={blocks.find(b => b.id === isEditing)?.button_text || ''}
                   onChange={(e) => onChange(blocks.map(b => b.id === isEditing ? { ...b, button_text: e.target.value } : b))}
                 />
                 <input 
                   className="w-full px-3 py-2 text-xs rounded-lg glass-input"
                   placeholder="Webhook URL (tuỳ chọn)"
                   value={blocks.find(b => b.id === isEditing)?.webhook_url || ''}
                   onChange={(e) => onChange(blocks.map(b => b.id === isEditing ? { ...b, webhook_url: e.target.value } : b))}
                 />
               </>
             )}
             <Button onClick={() => setIsEditing(null)} className="w-full" size="sm">Xong</Button>
          </div>
        </div>
      )}

      {/* Dnd Context */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {blocks.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-border rounded-2xl text-muted-foreground text-xs">
                Chưa có khối nội dung nào. Hãy thêm ở dưới.
              </div>
            ) : (
              blocks.map((block) => (
                <SortableBlockItem 
                  key={block.id}
                  id={block.id}
                  block={block}
                  products={products}
                  onEdit={(b) => setIsEditing(b.id)}
                  onDelete={handleDeleteBlock}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))
            )}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <SortableBlockItem 
              id={activeId}
              block={blocks.find(b => b.id === activeId)!}
              products={products}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggleVisibility={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add new blocks */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border mt-4">
        <Button onClick={() => handleAddBlock('LINK')} variant="outline" className="text-xs border-dashed border-border hover:border-brand-orange hover:text-brand-orange bg-transparent h-10">
          <Plus className="w-3.5 h-3.5 mr-1" /> Thêm Liên kết
        </Button>
        <Button onClick={() => handleAddBlock('PRODUCT')} variant="outline" className="text-xs border-dashed border-border hover:border-brand-orange hover:text-brand-orange bg-transparent h-10">
          <Plus className="w-3.5 h-3.5 mr-1" /> Thêm Sản phẩm
        </Button>
        <Button onClick={() => handleAddBlock('COUNTDOWN')} variant="outline" className="text-xs border-dashed border-border hover:border-purple-400 hover:text-purple-400 bg-transparent h-10">
          <Plus className="w-3.5 h-3.5 mr-1" /> Thêm Countdown
        </Button>
        <Button onClick={() => handleAddBlock('LEAD_FORM')} variant="outline" className="text-xs border-dashed border-border hover:border-teal-400 hover:text-teal-400 bg-transparent h-10">
          <Plus className="w-3.5 h-3.5 mr-1" /> Thu thập Email
        </Button>
      </div>
    </div>
  );
};
