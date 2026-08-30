import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  FileText,
  Star,
  ShoppingBag,
  Heart,
  Package,
  Building2,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { IProduct, IReview } from '../../types';
import { ImageGallery } from '../../components/product/ImageGallery';
import { TechnicalSpecs } from '../../components/product/TechnicalSpecs';
import { PriceDisplay } from '../../components/product/PriceDisplay';
import { StockBadge } from '../../components/product/StockBadge';
import { QuantitySelector } from '../../components/cart/QuantitySelector';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorState } from '../../components/common/ErrorState';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const res = await productService.getProductById(id);
        if (res.success && res.data) {
          setProduct(res.data);
          setQuantity(res.data.minOrderQuantity || 1);

          // Fetch reviews & related category products
          const [revRes, relRes] = await Promise.all([
            reviewService.getProductReviews(res.data._id),
            productService.getProducts({
              category: typeof res.data.category === 'object' ? res.data.category.slug : res.data.category,
              limit: 4,
            }),
          ]);

          if (revRes.success && revRes.data) setReviews(revRes.data);
          if (relRes.success && relRes.data) {
            setRelatedProducts(relRes.data.filter((p) => p._id !== res.data._id));
          }
        }
      } catch (error) {
        console.error('Error loading product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewComment.trim()) return;

    if (!isAuthenticated) {
      addToast('Please log in to submit a review', 'warning');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await reviewService.createReview(product._id, {
        rating: reviewRating,
        comment: reviewComment,
      });

      if (res.success) {
        addToast('Review submitted successfully', 'success');
        setReviewComment('');
        // Refresh reviews
        const revRes = await reviewService.getProductReviews(product._id);
        if (revRes.success && revRes.data) setReviews(revRes.data);
      }
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading technical specifications..." />;
  if (!product) return <ErrorState title="Product Not Found" message="The requested component does not exist in our catalogue." />;

  const isWishlisted = isInWishlist(product._id);
  const categoryName = typeof product.category === 'object' ? product.category.name : 'Category';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Top Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-3xl p-6 md:p-8 shadow-xs">
        {/* Left Image Gallery */}
        <div className="lg:col-span-6">
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Product Details & Buy Actions */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                {categoryName} | {product.brand}
              </span>
              <StockBadge stock={product.stock} lowStockThreshold={product.lowStockThreshold} />
            </div>

            <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-snug uppercase">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
              <span className="bg-gray-100 dark:bg-industrial-800 px-2 py-1 rounded-xs">
                SKU: {product.sku}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating || 4.8}</span>
                <span className="text-gray-400 font-normal">({product.reviewCount || 0} reviews)</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-industrial-950 rounded-2xl border border-gray-100 dark:border-industrial-800">
              <PriceDisplay
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                unit={product.unit}
                size="lg"
              />
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.shortDescription || product.description}
            </p>
          </div>

          {/* Action Box */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-industrial-800">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Quantity ({product.unit}s)
              </span>
              <QuantitySelector
                quantity={quantity}
                maxStock={product.stock}
                onChange={setQuantity}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                className="flex-1 py-3 text-sm"
                onClick={() => addToCart(product._id, quantity)}
                disabled={product.stock === 0}
                leftIcon={<ShoppingBag className="w-4 h-4" />}
              >
                {product.stock > 0 ? 'Add to Procurement Cart' : 'Currently Out of Stock'}
              </Button>

              <button
                onClick={() => toggleWishlist(product._id)}
                className={`p-3 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'border-gray-300 dark:border-industrial-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-500 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> 100% Tax Compliant Invoice
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-500" /> Pan-India Express Freight
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <TechnicalSpecs specifications={product.specifications} />

      {/* Product Description */}
      <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-industrial-800 pb-2">
          Detailed Description & Application Guidelines
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-industrial-800 pb-3">
          Verified Customer Reviews ({reviews.length})
        </h3>

        {/* Submit Review Form */}
        {isAuthenticated ? (
          <form onSubmit={handleReviewSubmit} className="bg-gray-50 dark:bg-industrial-950 p-4 rounded-xl border border-gray-200 dark:border-industrial-800 space-y-3 text-xs">
            <h4 className="font-bold text-gray-900 dark:text-white uppercase">Submit Your Product Feedback</h4>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-amber-400 focus:outline-none"
                  >
                    <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={3}
              placeholder="Share technical performance details, material quality & installation feedback..."
              className="w-full rounded-lg border border-gray-300 dark:border-industrial-700 bg-white dark:bg-industrial-900 p-2.5 text-gray-900 dark:text-gray-100 text-xs"
            />
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingReview}>
              Submit Review
            </Button>
          </form>
        ) : (
          <p className="text-xs text-gray-400 bg-gray-50 dark:bg-industrial-950 p-3 rounded-lg border border-gray-200 dark:border-industrial-800">
            Please <Link to="/login" className="text-brand-500 font-bold underline">log in</Link> to submit a review for this product.
          </p>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No reviews yet for this product.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="p-4 rounded-xl border border-gray-100 dark:border-industrial-800 bg-gray-50/50 dark:bg-industrial-950/40 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {typeof rev.user === 'object' ? rev.user.name : 'Verified Customer'}
                  </span>
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="ml-1">{rev.rating}.0</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{rev.comment}</p>
                <p className="text-[10px] text-gray-400 pt-1">{formatDate(rev.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
