import { useState, useEffect } from 'react';
import { Product, CreateCreditProductInput, EditProductInput } from '../types/products';

// Mock data for development
const mockProducts: Product[] = [
  {
    productId: 'prod_1',
    name: 'Basic API Credits',
    active: true,
    country: 'CM',
    description: 'Essential API access with basic credit allocation',
    productType: 'CREDIT_BASED',
    creditAllocation: {
      initialCredits: 1000,
      renewalCredits: 1000,
      expiryPeriod: 30,
      carryOverPolicy: 'PERCENTAGE',
      carryOverValue: 10
    },
    prices: [
      {
        priceId: 'price_1',
        name: 'Monthly Basic',
        active: true,
        currency: 'XAF',
        priceType: 'RECURRING',
        recurring: {
          interval: 'MONTH',
          usageType: 'LICENSE',
          intervalCount: 1
        },
        unitAmount: 25000,
        billingScheme: 'PER_UNIT',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    productId: 'prod_2',
    name: 'Professional API Credits',
    active: true,
    country: 'CM',
    description: 'Advanced API access with generous credit allocation and priority support',
    productType: 'CREDIT_BASED',
    creditAllocation: {
      initialCredits: 5000,
      renewalCredits: 5000,
      expiryPeriod: 60,
      carryOverPolicy: 'FULL'
    },
    prices: [
      {
        priceId: 'price_2',
        name: 'Monthly Professional',
        active: true,
        currency: 'XAF',
        priceType: 'RECURRING',
        recurring: {
          interval: 'MONTH',
          usageType: 'LICENSE',
          intervalCount: 1
        },
        unitAmount: 75000,
        billingScheme: 'PER_UNIT',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        priceId: 'price_3',
        name: 'Yearly Professional (Save 15%)',
        active: true,
        currency: 'XAF',
        priceType: 'RECURRING',
        recurring: {
          interval: 'YEAR',
          usageType: 'LICENSE',
          intervalCount: 1
        },
        unitAmount: 765000,
        billingScheme: 'PER_UNIT',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    productId: 'prod_3',
    name: 'Enterprise API Credits',
    active: false,
    country: 'CM',
    description: 'Enterprise-grade API access with unlimited credits and dedicated support',
    productType: 'CREDIT_BASED',
    creditAllocation: {
      initialCredits: 25000,
      renewalCredits: 25000,
      expiryPeriod: 90,
      carryOverPolicy: 'CAPPED',
      carryOverValue: 5000
    },
    prices: [
      {
        priceId: 'price_4',
        name: 'Monthly Enterprise',
        active: true,
        currency: 'XAF',
        priceType: 'RECURRING',
        recurring: {
          interval: 'MONTH',
          usageType: 'LICENSE',
          intervalCount: 1
        },
        unitAmount: 200000,
        billingScheme: 'PER_UNIT',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

export const useProducts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProducts(mockProducts);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const createProduct = async (input: CreateCreditProductInput): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProduct: Product = {
      productId: `prod_${Date.now()}`,
      name: input.name,
      active: true,
      country: 'CM',
      description: input.description,
      productType: 'CREDIT_BASED',
      creditAllocation: {
        initialCredits: input.initialCredits,
        renewalCredits: input.renewalCredits,
        expiryPeriod: input.expiryPeriod,
        carryOverPolicy: input.carryOverPolicy,
        carryOverValue: input.carryOverValue
      },
      prices: [
        {
          priceId: `price_${Date.now()}`,
          name: input.priceName,
          active: true,
          currency: 'XAF',
          priceType: 'RECURRING',
          recurring: {
            interval: 'MONTH',
            usageType: 'LICENSE',
            intervalCount: 1
          },
          unitAmount: input.unitAmount,
          billingScheme: 'PER_UNIT',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = async (productId: string, input: EditProductInput): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProducts(prev => prev.map(product => 
      product.productId === productId 
        ? { 
            ...product, 
            ...input,
            updatedAt: new Date().toISOString()
          }
        : product
    ));

    const updatedProduct = products.find(p => p.productId === productId);
    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    
    return { ...updatedProduct, ...input, updatedAt: new Date().toISOString() };
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setProducts(prev => prev.filter(product => product.productId !== productId));
  };

  return { products, loading, error, createProduct, updateProduct, deleteProduct };
};

export const useProduct = (productId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const found = mockProducts.find(p => p.productId === productId);
        if (found) {
          setProduct(found);
        } else {
          throw new Error('Product not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch product'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};