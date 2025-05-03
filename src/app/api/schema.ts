type ParsedReceipt = {
    items: {
        name: string;
        quantity: number;
        unitCost: number;
    }[];
    gst: number;
    serviceCharge: number;
};

export type { ParsedReceipt }; 