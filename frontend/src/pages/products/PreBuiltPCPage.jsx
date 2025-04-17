import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProductStore } from "../../stores/useProductStore";
import { useCartStore } from "../../stores/useCartStore";
import { ArrowLeft, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  categoryMappings as componentCategoryMapping,
  componentNames,
} from "../../components/BuildPC/componentUtils";

// Import modularized components
import PCTypeSelector from "../../components/PreBuiltPC/PCTypeSelector";
import BudgetSelector from "../../components/PreBuiltPC/BudgetSelector";
import CustomBudgetForm from "../../components/PreBuiltPC/CustomBudgetForm";
import PCConfigurationCard from "../../components/PreBuiltPC/PCConfigurationCard";
import {
  budgetRanges,
  typeDescriptions,
  generateConfigurations,
  generateCustomConfiguration,
} from "../../components/PreBuiltPC/configurationUtils";

const PreBuiltPCPage = () => {
  const navigate = useNavigate();
  const { products, loading, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();

  // State management
  const [selectedType, setSelectedType] = useState("gaming");
  const [selectedBudgetRange, setSelectedBudgetRange] = useState("budget");
  const [configurations, setConfigurations] = useState({});
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [isCustomBudget, setIsCustomBudget] = useState(false);
  const [customBudget, setCustomBudget] = useState(1000);
  const [customConfiguration, setCustomConfiguration] = useState(null);
  const [isGeneratingCustomBuild, setIsGeneratingCustomBuild] = useState(false);

  // Component display names from BuildPC utils
  const componentDisplayNames = componentNames;

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Generate the configurations based on products and selected type/budget
  useEffect(() => {
    if (!products || loading) return;

    const configs = generateConfigurations(products, componentCategoryMapping);
    setConfigurations(configs);
  }, [products, loading]);

  // Function to generate a custom budget configuration
  const handleGenerateCustomConfiguration = () => {
    if (!products || products.length === 0 || customBudget <= 0) return;

    setIsGeneratingCustomBuild(true);

    try {
      const config = generateCustomConfiguration({
        products,
        customBudget,
        selectedType,
        componentCategoryMapping,
      });

      setCustomConfiguration(config);
      toast.success(`Custom build created for ৳${customBudget} budget!`);
    } catch (error) {
      console.error("Error generating custom build:", error);
      toast.error("Failed to generate custom build");
    } finally {
      setIsGeneratingCustomBuild(false);
    }
  };

  // Handle adding a custom build to cart
  const handleAddCustomToCart = async () => {
    if (!customConfiguration) return;

    setAddingToCartId("custom");

    try {
      // Add each component to cart
      for (const [_, component] of Object.entries(
        customConfiguration.components,
      )) {
        if (component) {
          await addToCart(component._id, 1);
        }
      }
      toast.success("Custom PC build added to cart!");
      setTimeout(() => {
        navigate("/cart");
      }, 1000);
    } catch (error) {
      toast.error("Failed to add custom PC build to cart");
      console.error("Error adding custom PC to cart:", error);
    } finally {
      setAddingToCartId(null);
    }
  };

  // Handle adding a complete build to cart
  const handleAddToCart = async (pcType, budgetRange) => {
    const config = configurations[pcType]?.[budgetRange];
    if (!config) return;

    setAddingToCartId(`${pcType}-${budgetRange}`);

    try {
      // Add each component to cart
      for (const [_, component] of Object.entries(config.components)) {
        if (component) {
          await addToCart(component._id, 1);
        }
      }
      toast.success("Pre-built PC added to cart!");
      setTimeout(() => {
        navigate("/cart");
      }, 1000);
    } catch (error) {
      toast.error("Failed to add PC build to cart");
      console.error("Error adding pre-built PC to cart:", error);
    } finally {
      setAddingToCartId(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            {/* // TODO: Fixation neeeded */}
            <Link
              to="/products"
              className="hover:text-primary flex items-center font-medium"
            >
              <ArrowLeft size={18} className="mr-1" />
              Back to Products
            </Link>
            <h1 className="mt-4 text-3xl font-bold">
              Pre-Built PC Configurations
            </h1>
            <p className="text-base-content/70 mt-1">
              Choose from our professionally designed custom PC builds based on
              your budget and needs
            </p>
          </div>
        </div>

        {/* PC Type Selector Component */}
        <PCTypeSelector
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          typeDescriptions={typeDescriptions}
        />

        {/* Budget Selector Component */}
        <BudgetSelector
          isCustomBudget={isCustomBudget}
          setIsCustomBudget={setIsCustomBudget}
          selectedBudgetRange={selectedBudgetRange}
          setSelectedBudgetRange={setSelectedBudgetRange}
          budgetRanges={budgetRanges}
          selectedType={selectedType}
        />

        {/* Configuration Display Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Custom Budget Form and Configuration */}
            {isCustomBudget && (
              <>
                <CustomBudgetForm
                  customBudget={customBudget}
                  setCustomBudget={setCustomBudget}
                  generateCustomConfiguration={
                    handleGenerateCustomConfiguration
                  }
                  isGeneratingCustomBuild={isGeneratingCustomBuild}
                  selectedType={selectedType}
                />

                {customConfiguration && (
                  <PCConfigurationCard
                    pcType={selectedType}
                    budgetRange="custom"
                    configuration={customConfiguration}
                    budgetRangeName={customConfiguration.name}
                    isCustom={true}
                    targetBudget={customBudget}
                    onAddToCart={handleAddCustomToCart}
                    addingToCartId={addingToCartId}
                    componentDisplayNames={componentDisplayNames}
                  />
                )}
              </>
            )}

            {/* Predefined Budget Configuration */}
            {!isCustomBudget &&
            configurations[selectedType]?.[selectedBudgetRange] ? (
              <PCConfigurationCard
                pcType={selectedType}
                budgetRange={selectedBudgetRange}
                configuration={
                  configurations[selectedType][selectedBudgetRange]
                }
                budgetRangeName={
                  budgetRanges[selectedType][selectedBudgetRange].name
                }
                description={
                  selectedType === "gaming"
                    ? "Optimized for gaming performance"
                    : selectedType === "productivity"
                      ? "Optimized for professional workflows"
                      : "Optimized for everyday computing needs"
                }
                onAddToCart={handleAddToCart}
                addingToCartId={addingToCartId}
                componentDisplayNames={componentDisplayNames}
              />
            ) : (
              !isCustomBudget && (
                <div className="py-12 text-center">
                  <div className="mb-4 flex justify-center">
                    <Info size={48} className="text-base-content/30" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    No Configuration Available
                  </h3>
                  <p className="mt-2">
                    We couldn't generate a configuration for this selection.
                    Please try a different budget range or PC type.
                  </p>
                </div>
              )
            )}

            <div className="alert bg-base-200 mb-8">
              <Info size={20} />
              <div>
                <p>
                  Looking for more customization? Visit our PC Builder page to
                  create a completely custom build.
                </p>
                <Link to="/build-pc" className="btn btn-sm btn-primary mt-2">
                  Go to PC Builder
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreBuiltPCPage;
