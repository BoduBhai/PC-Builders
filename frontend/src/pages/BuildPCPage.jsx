import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { ShoppingCart, ChevronRight, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

// Import custom components
import ComponentSection from "../components/BuildPC/ComponentSection";
import ComponentModal from "../components/BuildPC/ComponentModal";
import { useComponentFilter } from "../components/BuildPC/useComponentFilter";
import {
  getComponentImage,
  getComponentName,
  getCategoryForComponentType,
  componentCategories,
} from "../components/BuildPC/componentUtils";

const BuildPCPage = () => {
  const { products, loading, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const location = useLocation();
  const [selectedComponents, setSelectedComponents] = useState({
    processor: null,
    motherboard: null,
    graphicsCard: null,
    cpuCooler: null,
    ram1: null,
    ram2: null,
    ssd: null,
    hdd: null,
    powerSupply: null,
    casing: null,
    monitor: null,
    caseFan: null,
    mouse: null,
    keyboard: null,
    headphone: null,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [fromPreBuilt, setFromPreBuilt] = useState(false);

  const { coreComponents, peripherals, accessories } = componentCategories;

  // Memorized callback for showing component modal
  const showComponentModal = useCallback((componentType) => {
    setSearchTerm("");
    setActiveModal(componentType);
  }, []);

  // Close the modal
  const closeModal = useCallback(() => {
    setActiveModal(null);
    setSearchTerm("");
  }, []);

  // Handle component selection
  const handleComponentSelect = useCallback((componentType, product) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [componentType]: product,
    }));
    setActiveModal(null);
  }, []);

  // Use our custom hook to filter products
  const filteredProducts = useComponentFilter(
    products,
    activeModal,
    searchTerm,
    getCategoryForComponentType,
  );

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Load pre-built configuration if coming from PreBuiltPCPage
  useEffect(() => {
    // Check if we have components data in location state (from pre-built page)
    if (
      location.state?.fromPreBuilt &&
      location.state?.components &&
      products.length > 0
    ) {
      setFromPreBuilt(true);
      // Apply the pre-built components to our selected components state
      setSelectedComponents((prevComponents) => ({
        ...prevComponents,
        ...location.state.components,
      }));

      // Show toast notification
      toast.success(
        "Pre-built configuration loaded! You can now customize it.",
        {
          duration: 4000,
          icon: "🔧",
        },
      );
    }
  }, [location.state, products]);

  // Update total amount when selected components change
  useEffect(() => {
    let total = 0;
    Object.values(selectedComponents).forEach((component) => {
      if (component) {
        total += component.onDiscount
          ? component.discountPrice
          : component.price;
      }
    });
    setTotalAmount(total);
  }, [selectedComponents]);

  // Add entire build to cart
  const handleAddBuildToCart = async () => {
    if (!selectedComponents.processor || !selectedComponents.motherboard) {
      toast.error(
        "Processor and Motherboard are required to complete your build.",
      );
      return;
    }

    setAddingToCart(true);
    try {
      // Get current cart to check for existing items
      const currentCart = useCartStore.getState().cart;
      let addedCount = 0;
      let skippedCount = 0;

      // Add each component to cart sequentially
      for (const [_, component] of Object.entries(selectedComponents)) {
        if (component) {
          // Check if this component is already in cart
          const alreadyInCart = currentCart.items.some(
            (item) => item.product._id === component._id,
          );

          if (!alreadyInCart) {
            await addToCart(component._id, 1);
            addedCount++;
          } else {
            skippedCount++;
          }
        }
      }

      if (addedCount > 0) {
        if (skippedCount > 0) {
          toast.success(
            `Added ${addedCount} components to cart. ${skippedCount} components were already in your cart.`,
          );
        } else {
          toast.success("PC Build added to cart!");
        }
      } else if (skippedCount > 0) {
        toast.info("All selected components are already in your cart!");
      }
    } catch (error) {
      toast.error("Failed to add all components to cart.");
      console.error("Error adding build to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {fromPreBuilt && (
          <div className="mb-6">
            <Link
              to="/products/pre-built-pc"
              className="btn btn-outline btn-sm mb-3 flex w-fit items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Pre-built Configurations
            </Link>
            <div className="alert alert-info shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 flex-shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold">Pre-built configuration loaded!</h3>
                  <div className="text-xs">
                    You can now customize this configuration by changing any
                    component.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-success mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">
            PC Builder - Build your own PC
          </h1>
          <p className="text-success/70">
            Select components to create your custom PC build
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="lg:w-3/4">
            {/* Core Components Section */}
            <ComponentSection
              title="Core Components"
              components={coreComponents}
              selectedComponents={selectedComponents}
              getComponentImage={getComponentImage}
              getComponentName={getComponentName}
              showComponentModal={showComponentModal}
              requiredComponents={["processor", "motherboard"]}
            />

            {/* Peripherals Section */}
            <ComponentSection
              title="Peripherals & Others"
              components={peripherals}
              selectedComponents={selectedComponents}
              getComponentImage={getComponentImage}
              getComponentName={getComponentName}
              showComponentModal={showComponentModal}
            />

            {/* Accessories Section */}
            <ComponentSection
              title="Accessories"
              components={accessories}
              selectedComponents={selectedComponents}
              getComponentImage={getComponentImage}
              getComponentName={getComponentName}
              showComponentModal={showComponentModal}
            />
          </div>

          <div className="lg:w-1/4">
            <div className="card bg-base-100 sticky top-20 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">Total Amount</h2>
                <div className="my-4 text-center text-3xl font-bold">
                  ৳{totalAmount.toFixed(2)}
                </div>
                <div className="mt-4">
                  <button
                    className="btn btn-primary btn-block flex items-center justify-center gap-2"
                    disabled={
                      !selectedComponents.processor ||
                      !selectedComponents.motherboard ||
                      addingToCart
                    }
                    onClick={handleAddBuildToCart}
                  >
                    {addingToCart ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <Link
                    to="/products"
                    className="btn btn-outline btn-block mt-2"
                  >
                    Browse More Components
                  </Link>
                </div>
                <div className="divider">OR</div>
                <div className="text-center text-sm">
                  Need help choosing? Check our
                  <Link
                    to="/products/pre-built-pc"
                    className="text-primary mt-1 ml-1 flex items-center justify-center hover:underline"
                  >
                    Pre-built PC Options
                    <ChevronRight size={16} />
                  </Link>
                </div>

                {(!selectedComponents.processor ||
                  !selectedComponents.motherboard) && (
                  <div
                    role="alert"
                    className="alert mt-4 bg-red-600/70 text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 shrink-0 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Processor and Motherboard are required to complete your
                      build.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Selection Modal */}
      <ComponentModal
        activeModal={activeModal}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        closeModal={closeModal}
        getComponentName={getComponentName}
        filteredProducts={filteredProducts}
        handleComponentSelect={handleComponentSelect}
      />
    </div>
  );
};

export default BuildPCPage;
