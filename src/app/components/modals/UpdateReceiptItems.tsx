import { ParsedReceipt, ReceiptItem } from "@/db/types";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { motion } from "motion/react";
import { FiEdit3 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import GlassContainer from "../ui/GlassContainer";
import { useCallback, useState } from "react";

interface IUpdateReceiptItems {
    receiptItemDetails: ParsedReceipt,
    setReceiptItemDetails: (val: ParsedReceipt) => void;
    hideModal: () => void
}

export default function UpdateReceiptItems({ receiptItemDetails, setReceiptItemDetails, hideModal }: IUpdateReceiptItems) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState<boolean>(false);

    const editItem = useCallback((index: number, updatedItem: ReceiptItem) => {
        const updatedItems = [...receiptItemDetails.items];
        updatedItems[index] = updatedItem;
        setReceiptItemDetails({
            ...receiptItemDetails,
            items: updatedItems
        });
        setEditingIndex(null);
    }, [receiptItemDetails, setReceiptItemDetails]);

    const addItem = useCallback((newItem: ReceiptItem) => {
        setReceiptItemDetails({
            ...receiptItemDetails,
            items: [...receiptItemDetails.items, newItem]
        });
        setIsAdding(false);
    }, [receiptItemDetails, setReceiptItemDetails]);

    const deleteItem = useCallback((item: ReceiptItem) => {
        setReceiptItemDetails({
            ...receiptItemDetails,
            items: receiptItemDetails.items.filter(i => i.name !== item.name)
        });
    }, [receiptItemDetails, setReceiptItemDetails]);
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-50 fixed inset-0 w-screen h-screen bg-black/15 backdrop-blur-sm flex items-center justify-center p-0 lg:p-20"
        >
            <GlassContainer styles="z-[60] w-full h-full rounded-none lg:rounded-xl lg:w-auto lg:h-auto lg:min-w-[600px] lg:max-w-4xl lg:max-h-[80vh] overflow-y-auto">
                <div className="text-2xl font-semibold pb-3 mb-3 border-b border-white/20 flex items-center justify-between">
                    <h2>Edit Receipt Items</h2>
                    <FaXmark className="cursor-pointer" onClick={hideModal} />
                </div>
                <div className="flex flex-col gap-4">
                    { receiptItemDetails.items.length > 0 ? (
                        receiptItemDetails.items.map((item, index) => (
                            <ReceiptItemRow
                                key={index} 
                                item={item} 
                                isEditing={editingIndex === index}
                                onEdit={() => setEditingIndex(index)}
                                onSave={(updatedItem) => editItem(index, updatedItem)}
                                onCancel={() => setEditingIndex(null)}
                                onDelete={() => deleteItem(item)}
                            />
                        ))
                    ) : (
                        <p className="text-center text-dark-secondary">No items to display.</p>
                    )}

                    {isAdding ? (
                        <AddItemForm 
                            onSave={addItem}
                            onCancel={() => setIsAdding(false)}
                        />
                    ) : (
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="p-3 bg-dark-accent hover:bg-accent text-dark-background rounded-md font-semibold flex items-center justify-center gap-2 w-full sm:w-auto transition-colors"
                        >
                            <FaPlus />
                            <p>Add Item</p>
                        </button>
                    )}
                </div>
            </GlassContainer>
        </motion.div>
    )
}

interface IReceiptItemRow {
    item: ReceiptItem,
    isEditing: boolean;
    onEdit: () => void;
    onSave: (item: ReceiptItem) => void;
    onCancel: () => void;
    onDelete: () => void;
}

function ReceiptItemRow({ 
    item, 
    isEditing, 
    onEdit, 
    onSave, 
    onCancel, 
    onDelete  
}: IReceiptItemRow) {
    const [editedItem, setEditedItem] = useState<ReceiptItem>(item);

    const handleSave = () => {
        onSave(editedItem);
    };

    const handleCancel = () => {
        setEditedItem(item);
        onCancel();
    };

    if (isEditing) {
        return (
            <GlassContainer>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Item Name</label>
                        <input
                            type="text"
                            value={editedItem.name}
                            onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
                            className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50"
                            placeholder="Enter item name"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={editedItem.quantity}
                                onChange={(e) => setEditedItem({...editedItem, quantity: parseInt(e.target.value) || 1})}
                                className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Unit Cost</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editedItem.unitCost}
                                onChange={(e) => setEditedItem({...editedItem, unitCost: parseFloat(e.target.value) || 0})}
                                className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button 
                            onClick={handleSave}
                            className="px-4 py-2 bg-dark-accent text-white rounded-md font-medium transition-colors"
                        >
                            Save
                        </button>
                        <button 
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </GlassContainer>
        );
    }

    return (
        <GlassContainer>
            <p className="text-xl font-semibold mb-1">{ item.name }</p>
            <div className="flex flex-row place-content-between gap-3">
                <p><span className="font-semibold">Quantity: </span>{ item.quantity }</p>
                <p><span className="font-semibold">Unit Cost: </span>{ item.unitCost }</p>
            </div>
            <div className="mt-1 inline-flex flex-row gap-3">
                <GlassContainer isPadding={false}>
                    <button onClick={onEdit} className="inline-flex flex-row gap-2 items-center px-2">
                        <FiEdit3 />
                        <p>Edit</p>
                    </button>
                </GlassContainer>
                <GlassContainer isPadding={false}>
                    <button onClick={onDelete} className="inline-flex flex-row gap-2 items-center px-2">
                        <FaRegTrashCan className="text-red-500" />
                        <p className="text-red-500">Delete</p>
                    </button>
                </GlassContainer>
            </div>
        </GlassContainer>
    )
}

function AddItemForm({ onSave, onCancel }: { onSave: (item: ReceiptItem) => void; onCancel: () => void }) {
    const [newItem, setNewItem] = useState<ReceiptItem>({
        name: '',
        quantity: 1,
        unitCost: 0,
        shares: []
    });

    const handleSave = () => {
        if (newItem.name.trim() === '') {
            alert('Please enter an item name');
            return;
        }
        if (newItem.quantity <= 0) {
            alert('Quantity must be greater than 0');
            return;
        }
        if (newItem.unitCost < 0) {
            alert('Unit cost cannot be negative');
            return;
        }
        onSave(newItem);
    };

    return (
        <GlassContainer>
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Add New Item</h3>
                <div>
                    <label className="block text-sm font-medium mb-1">Item Name *</label>
                    <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50"
                        placeholder="Enter item name"
                        autoFocus
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                            className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Unit Cost</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={newItem.unitCost}
                            onChange={(e) => setNewItem({...newItem, unitCost: parseFloat(e.target.value) || 0})}
                            className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
                        />
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-dark-accent text-white rounded-md font-medium transition-colors"
                    >
                        Add Item
                    </button>
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </GlassContainer>
    );
}