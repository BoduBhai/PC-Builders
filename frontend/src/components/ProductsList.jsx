import { useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { toast } from "react-hot-toast";

// Import modularized components
import ProductTable from "./Admin/Products/ProductTable";
import EditProductModal from "./Admin/Products/EditProductModal";
import DiscountModal from "./Admin/Products/DiscountModal";
import DeleteConfirmationModal from "./Admin/Products/DeleteConfirmationModal";

const ProductsList = () => {
  const {
    products,
    toggleProductDiscount,
    updateProduct,
    deleteProduct,
    loading,
  } = useProductStore();

  const [editProductData, setEditProductData] = useState(null);
  const [discountProductData, setDiscountProductData] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Handle edit product modal
  const handleEditClick = (product) => {
    setEditProductData(product);
    document.getElementById(`edit_modal_${product._id}`).showModal();
  };

  const handleProductUpdate = async (productId, formData) => {
    try {
      await updateProduct(productId, formData);
      document.getElementById(`edit_modal_${productId}`).close();
      setEditProductData(null);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Failed to update product";
      toast.error(errorMsg);
      console.error("Product update error:", error);
    }
  };

  // Handle discount modal
  const handleDiscountToggleClick = (product) => {
    setDiscountProductData(product);
    document.getElementById(`discount_modal_${product._id}`).showModal();
  };

  const handleDiscountToggle = async (product, discountData) => {
    try {
      if (!product.onDiscount) {
        await toggleProductDiscount(product._id, discountData);
      } else {
        await toggleProductDiscount(product._id);
      }
      document.getElementById(`discount_modal_${product._id}`).close();
      setDiscountProductData(null);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Failed to update discount";
      toast.error(errorMsg);
      console.error("Discount update error:", error);
    }
  };

  // Handle delete product modal
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    document.getElementById("delete_product_modal").showModal();
  };

  const confirmProductDelete = async () => {
    try {
      await deleteProduct(productToDelete?._id);
      document.getElementById("delete_product_modal").close();
      setProductToDelete(null);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Failed to delete product";
      toast.error(errorMsg);
      console.error("Product deletion error:", error);
    }
  };

  return (
    <div className="container mx-auto mb-20 max-w-6xl rounded-lg p-5">
      {/* Products Table */}
      <h2 className="mb-10 text-center text-xl font-bold">Products List</h2>

      <ProductTable
        products={products}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onDiscountToggleClick={handleDiscountToggleClick}
      />

      {/* Modals for each product */}
      {products?.map((product) => (
        <div key={`modals-${product._id}`}>
          {/* Edit Product Modal */}
          <EditProductModal
            product={product}
            loading={loading}
            onSave={handleProductUpdate}
          />

          {/* Discount Modal */}
          <DiscountModal
            product={product}
            loading={loading}
            onApplyDiscount={handleDiscountToggle}
          />
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        product={productToDelete}
        loading={loading}
        onConfirmDelete={confirmProductDelete}
      />
    </div>
  );
};

export default ProductsList;
