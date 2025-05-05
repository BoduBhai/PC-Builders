import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useOrderStore } from "../stores/useOrderStore";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { formatDate } from "../utils/dateUtils";
import {
  CheckCircle,
  ArrowLeft,
  FileText,
  Clock,
  CreditCard,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { currentOrder, fetchOrderById, loading } = useOrderStore();
  const { clearCart } = useCartStore();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch order details
    const loadOrder = async () => {
      try {
        await fetchOrderById(orderId);

        // Clear the cart once the order is confirmed and loaded
        clearCart();
      } catch (error) {
        // If there's an error fetching the order, redirect to orders page
        console.error("Error fetching order:", error);
        navigate("/orders");
      }
    };

    loadOrder();
  }, [fetchOrderById, navigate, orderId, user, clearCart]);

  if (loading || !currentOrder) {
    return <LoadingSpinner size="lg" />;
  }

  // Format the date
  const orderDate = formatDate(currentOrder.createdAt);

  return (
    <div className="bg-base-200 rounded-lg p-6">
      <header className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle className="text-success" size={60} />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-base-content/70">
          Thank you for your purchase. Your order has been received.
        </p>
      </header>

      <div className="bg-base-100 mx-auto max-w-4xl rounded-lg p-6 shadow-lg">
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-base-content/60 mb-2 text-sm font-semibold">
              ORDER NUMBER
            </h3>
            <p className="flex items-center text-lg font-semibold">
              <FileText size={18} className="mr-2" />#
              {currentOrder._id.substring(currentOrder._id.length - 8)}
            </p>
          </div>

          <div>
            <h3 className="text-base-content/60 mb-2 text-sm font-semibold">
              DATE PLACED
            </h3>
            <p className="flex items-center text-lg font-semibold">
              <Clock size={18} className="mr-2" />
              {orderDate}
            </p>
          </div>

          <div>
            <h3 className="text-base-content/60 mb-2 text-sm font-semibold">
              TOTAL AMOUNT
            </h3>
            <p className="text-lg font-semibold">
              ৳{currentOrder.total.toFixed(2)}
            </p>
          </div>

          <div>
            <h3 className="text-base-content/60 mb-2 text-sm font-semibold">
              PAYMENT METHOD
            </h3>
            <p className="flex items-center text-lg font-semibold">
              <CreditCard size={18} className="mr-2" />
              {currentOrder.paymentMethod === "card"
                ? "Credit/Debit Card"
                : currentOrder.paymentMethod === "bank_transfer"
                  ? "Bank Transfer"
                  : "Pay during pickup"}
            </p>
          </div>
        </div>

        <div className="mb-6 border-t border-b py-4">
          <h3 className="mb-4 font-semibold">Order Status</h3>
          <div className="flex items-center justify-center">
            <div className="grid w-full grid-cols-4 gap-2">
              <div
                className={`flex flex-col items-center text-center ${currentOrder.orderStatus === "processing" ? "text-primary" : ""}`}
              >
                <div
                  className={`mb-2 h-8 w-8 rounded-full ${currentOrder.orderStatus === "processing" ? "bg-primary text-primary-content" : "bg-base-300 text-base-content"} flex items-center justify-center text-sm`}
                >
                  1
                </div>
                <span className="text-xs">Processing</span>
              </div>

              <div
                className={`flex flex-col items-center text-center ${currentOrder.orderStatus === "shipped" ? "text-primary" : ""}`}
              >
                <div
                  className={`mb-2 h-8 w-8 rounded-full ${currentOrder.orderStatus === "shipped" ? "bg-primary text-primary-content" : "bg-base-300 text-base-content"} flex items-center justify-center text-sm`}
                >
                  2
                </div>
                <span className="text-xs">Shipped</span>
              </div>

              <div
                className={`flex flex-col items-center text-center ${currentOrder.orderStatus === "shipped" ? "text-primary" : ""}`}
              >
                <div
                  className={`mb-2 h-8 w-8 rounded-full ${currentOrder.orderStatus === "shipped" ? "bg-primary text-primary-content" : "bg-base-300 text-base-content"} flex items-center justify-center text-sm`}
                >
                  3
                </div>
                <span className="text-xs">On the way</span>
              </div>

              <div
                className={`flex flex-col items-center text-center ${currentOrder.orderStatus === "delivered" ? "text-primary" : ""}`}
              >
                <div
                  className={`mb-2 h-8 w-8 rounded-full ${currentOrder.orderStatus === "delivered" ? "bg-primary text-primary-content" : "bg-base-300 text-base-content"} flex items-center justify-center text-sm`}
                >
                  4
                </div>
                <span className="text-xs">Delivered</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-4 font-semibold">Items</h3>
          <div className="space-y-3">
            {currentOrder.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center rounded-lg border p-3"
              >
                <div className="h-16 w-16 overflow-hidden rounded-md">
                  <img
                    src={item.product.image}
                    alt={item.product.modelNo}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="font-medium">{item.product.modelNo}</div>
                  <div className="text-base-content/70 text-sm">
                    Qty: {item.quantity}
                  </div>
                </div>
                <div className="font-medium">
                  ৳{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold">Shipping Address</h3>
            <address className="not-italic">
              {currentOrder.shippingAddress.street}
              <br />
              {currentOrder.shippingAddress.city},{" "}
              {currentOrder.shippingAddress.state}{" "}
              {currentOrder.shippingAddress.zipCode}
              <br />
              {currentOrder.shippingAddress.country}
            </address>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Order Summary</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳{currentOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>৳{currentOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>৳{currentOrder.shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-1">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>৳{currentOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {currentOrder.paymentMethod === "bank_transfer" && (
          <div className="bg-base-200 mb-6 rounded-lg p-4">
            <h3 className="mb-2 font-semibold">Payment Instructions</h3>
            <p className="mb-3 text-sm">
              Please transfer the total amount to the following bank account:
            </p>
            <div className="mb-3 text-sm">
              <div className="mb-1 grid grid-cols-2">
                <span className="font-medium">Bank:</span>
                <span>Bangladesh Bank</span>
              </div>
              <div className="mb-1 grid grid-cols-2">
                <span className="font-medium">Account Name:</span>
                <span>PC Builders Inc.</span>
              </div>
              <div className="mb-1 grid grid-cols-2">
                <span className="font-medium">Account Number:</span>
                <span>XXXX-XXXX-XXXX-1234</span>
              </div>
              <div className="mb-1 grid grid-cols-2">
                <span className="font-medium">Reference:</span>
                <span>
                  #{currentOrder._id.substring(currentOrder._id.length - 8)}
                </span>
              </div>
            </div>
          </div>
        )}

        {currentOrder.paymentMethod === "pay_on_pickup" && (
          <div className="bg-base-200 mb-6 rounded-lg p-4">
            <h3 className="mb-2 font-semibold">Pickup Payment Information</h3>
            <p className="mb-3 text-sm">
              You've selected to pay during pickup. Please note the following
              information:
            </p>
            <div className="mb-3 text-sm">
              <div className="mb-1 grid grid-cols-2">
                <span className="font-medium">Payment Status:</span>
                <span className="badge badge-warning">Pending</span>
              </div>
              <div className="mb-1 grid grid-cols-2">
                <span className="font-medium">Store Address:</span>
                <span>PC Builders Store, 123 Tech Street, Dhaka</span>
              </div>
              <div className="mb-1 grid grid-cols-2">
                <span className="font-medium">Store Hours:</span>
                <span>Mon-Sat: 10:00 AM - 8:00 PM</span>
              </div>
              <div className="mb-1 grid grid-cols-2">
                <span className="font-medium">Order Reference:</span>
                <span className="font-mono">
                  #{currentOrder._id.substring(currentOrder._id.length - 8)}
                </span>
              </div>
              <div className="mb-1 grid grid-cols-2">
                <span className="font-medium">Payment Methods Accepted:</span>
                <span>Cash, Credit/Debit Card, Mobile Payment</span>
              </div>
            </div>
            <div className="alert alert-info mt-2 text-sm">
              <p>
                Please bring a valid ID and your order reference number when
                picking up your order. Your items will be held for 7 days.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link to="/orders" className="btn btn-ghost gap-2">
            <ArrowLeft size={20} />
            View My Orders
          </Link>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
