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

  // Handle component removal
  const handleComponentRemove = useCallback((componentType) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [componentType]: null,
    }));
    toast.success(
      `Removed ${getComponentName(componentType)} from your build.`,
    );
  }, []);

  // Use our custom hook to filter products
  const filteredProducts = useComponentFilter(
    products,
    activeModal,
    searchTerm,
    getCategoryForComponentType,
  );

  const selectedProductIdsMap = React.useMemo(() => {
    const map = {};
    Object.values(selectedComponents)
      .filter((component) => component !== null)
      .forEach((component) => {
        map[component._id] = true;
      });
    return map;
  }, [selectedComponents]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Load pre-built configuration if coming from PreBuiltPCPage
  useEffect(() => {
    if (
      location.state?.fromPreBuilt &&
      location.state?.components &&
      products.length > 0
    ) {
      setFromPreBuilt(true);
      setSelectedComponents((prevComponents) => ({
        ...prevComponents,
        ...location.state.components,
      }));
    }
  }, [location.state, products]);

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
    <main className="min-h-screen">
      <div className="container mx-auto px-4">
        {fromPreBuilt && (
          <section className="mb-6">
            <Link
              to="/products/pre-built-pc"
              className="btn btn-outline btn-sm mb-3 flex w-fit items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Pre-built Configurations
            </Link>
            <div className="alert alert-info flex flex-col shadow-lg">
              <h2 className="text-xl font-bold">
                Pre-built configuration loaded!
              </h2>
              <div className="text-xs">
                You can now customize this configuration by changing any
                component.
              </div>
            </div>
          </section>
        )}

        <header className="mb-8 text-center">
          <h1 className="from-primary via-secondary to-info mb-2 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-widest text-transparent">
            BUILD YOUR OWN PC
          </h1>
          <p className="text-primary text-md">
            Select components to create your custom PC build
          </p>
        </header>

        <div className="flex flex-col gap-6 lg:flex-row">
          <section className="lg:w-3/4">
            {/* Core Components Section */}
            <ComponentSection
              title="Core Components"
              components={coreComponents}
              selectedComponents={selectedComponents}
              getComponentImage={getComponentImage}
              getComponentName={getComponentName}
              showComponentModal={showComponentModal}
              onRemoveComponent={handleComponentRemove}
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
              onRemoveComponent={handleComponentRemove}
            />

            {/* Accessories Section */}
            <ComponentSection
              title="Accessories"
              components={accessories}
              selectedComponents={selectedComponents}
              getComponentImage={getComponentImage}
              getComponentName={getComponentName}
              showComponentModal={showComponentModal}
              onRemoveComponent={handleComponentRemove}
            />
          </section>

          <aside className="lg:w-1/4">
            <div className="card bg-base-200 sticky top-20 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">Total Amount</h2>
                <div className="my-4 text-center text-3xl font-bold">
                  ৳{totalAmount.toFixed(2)}
                </div>
                <nav className="mt-4">
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
                </nav>
                <div className="divider">OR</div>
                <footer className="text-center text-sm">
                  Need help choosing? Check our
                  <Link
                    to="/products/pre-built-pc"
                    className="text-primary mt-1 ml-1 flex items-center justify-center hover:underline"
                  >
                    Pre-built PC Options
                    <ChevronRight size={16} />
                  </Link>
                </footer>

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
          </aside>
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
        selectedProductIdsMap={selectedProductIdsMap}
        onRemoveComponent={handleComponentRemove}
      />
    </main>
  );
};

export default BuildPCPage;
