export class OrderedProductResponseDto {
  orderedProductId: number;

  productId: number;

  quantity: number;

  productName: string;

  description: string;

  priceAtOrder: number;

  imagesUrlAtOrder?: string[];
}

export class OrderResponseDto {
  orderId: number;

  userId: string;

  date: Date;

  status: string;

  total: number;

  products: OrderedProductResponseDto[];
}
