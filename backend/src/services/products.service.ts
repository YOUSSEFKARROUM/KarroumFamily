import { PrismaClient } from '@prisma/client';
import { ProductFilters, ProductResponse } from '../types/product.types';

const prisma = new PrismaClient();

export class ProductsService {
  async getProducts(filters: ProductFilters): Promise<ProductResponse> {
    const {
      page = 1,
      limit = 12,
      category,
      featured,
      sortBy = 'createdAt',
      order = 'desc',
      search,
      minPrice,
      maxPrice
    } = filters;

    const skip = (page - 1) * limit;

    // Construire les conditions de filtrage
    const where: any = {
      isActive: true
    };

    if (category) {
      where.categoryId = category;
    }

    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Construire l'ordre de tri
    const orderBy: any = {};
    if (sortBy === 'price') {
      orderBy.price = order;
    } else if (sortBy === 'name') {
      orderBy.name = order;
    } else if (sortBy === 'rating') {
      // Pour le tri par rating, on utilisera une moyenne des reviews
      orderBy.reviews = {
        _count: order
      };
    } else {
      orderBy[sortBy] = order;
    }

    // Exécuter les requêtes
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              nameAr: true,
              icon: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              reviews: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ]);

    // Calculer les ratings moyens
    const productsWithRating = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;

      return {
        ...product,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: product._count.reviews,
        reviews: undefined, // Supprimer les reviews détaillées
        _count: undefined
      };
    });

    return {
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id, isActive: true },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            icon: true
          }
        },
        reviews: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!product) {
      return null;
    }

    // Calculer le rating moyen
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    return {
      ...product,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length
    };
  }

  async getProductsByCategory(categoryId: string, limit = 8) {
    return await prisma.product.findMany({
      where: {
        categoryId,
        isActive: true
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: {
          select: {
            name: true,
            nameAr: true,
            icon: true
          }
        }
      }
    });
  }

  async getFeaturedProducts(limit = 6) {
    return await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: {
          select: {
            name: true,
            nameAr: true,
            icon: true
          }
        }
      }
    });
  }

  async searchProducts(query: string, limit = 10) {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { nameAr: { contains: query } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: limit,
      include: {
        category: {
          select: {
            name: true,
            nameAr: true,
            icon: true
          }
        }
      }
    });
  }

  async updateStock(productId: string, quantity: number) {
    return await prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity
        }
      }
    });
  }

  async getLowStockProducts(threshold = 5) {
    return await prisma.product.findMany({
      where: {
        stock: {
          lte: threshold
        },
        isActive: true
      },
      include: {
        category: {
          select: {
            name: true,
            nameAr: true
          }
        }
      }
    });
  }
}