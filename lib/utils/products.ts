import { Product } from '@/lib/types';
import { promises as fs } from 'fs';
import path from 'path';
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from 'next/cache';

// Helper function to read the database
async function readDB() {
  const dbPath = path.join(process.cwd(), 'db.json');
  const data = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(data);
}

export const getProducts = async (): Promise<Product[]> => {
	'use cache';
	try {
		const db = await readDB();
		cacheTag('products');
		cacheLife('minutes');
		return db.products;
	} catch (error) {
		console.error('Error fetching products:', error);
		throw new Error('Failed to fetch products');
	}
};

export const getProduct = async (id: string): Promise<Product> => {
	try {
		const products = await getProducts();
		const product = products.find((product) => product.id === id);
		if (!product) {
			throw new Error(`Product with id ${id} not found`);
		}
		return product;
	} catch (error) {
		console.error('Error fetching product:', error);
		throw error;
	}
};

export const getFeaturedProduct = async (): Promise<Product> => {
	try {
		const products = await getProducts();
		const featuredProducts = products.filter((product) => product.isFeatured);
		if (featuredProducts.length === 0) {
			throw new Error('No featured products found');
		}
		return featuredProducts[0];
	} catch (error) {
		console.error('Error fetching featured product:', error);
		throw error;
	}
};

export const getBestSellers = async (): Promise<Product[]> => {
	try {
		const products = await getProducts();
		const bestSellers = products.filter((product) => product.isBestSeller);
		if (bestSellers.length === 0) {
			throw new Error('No best-selling products found');
		}
		return bestSellers;
	} catch (error) {
		console.error('Error fetching best sellers:', error);
		throw error;
	}
};
