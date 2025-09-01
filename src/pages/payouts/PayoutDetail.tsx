import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import ViewNotePopup from '../../components/common/ViewNotePopup';
import { usePayouts } from '../../hooks/usePayouts';
import { helpers } from '../../utils/helper';

interface Transaction {
  id: string;
  amount: number;
  note: string;
  createdAt: string;
}

interface PayoutDetailData {
  earningId: string;
  totalEarningAmount: number;
  totalPaidByAdmin: number;
  remainingAmount: number;
  status: string;
  remarks: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  product: {
    id: string;
    productName: string;
  };
  orderDetails: {
    orderId: string;
    price: number;
    type: string;
    rentFrom: string;
    rentTo: string;
  };
  transactions: Transaction[];
}

const PayoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [payoutDetail, setPayoutDetail] = useState<PayoutDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isNotePopupOpen, setIsNotePopupOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');
  const { getPayoutDetail } = usePayouts();

  useEffect(() => {
    const fetchPayoutDetail = async () => {
      try {
        setLoading(true);
        const response = await getPayoutDetail(id!);
        setPayoutDetail(response);
      } catch (error) {
        console.error('Error fetching payout detail:', error);
        setError('Failed to fetch payout details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPayoutDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !payoutDetail) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">
        {error || 'Payout not found'}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/payouts"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Payouts
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payout Details
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Details</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
              <p className="text-gray-900 dark:text-white">{payoutDetail.user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
              <p className="text-gray-900 dark:text-white">{payoutDetail.user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
              <p className="text-gray-900 dark:text-white">{payoutDetail.user.phone}</p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Product Details</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Product Name</label>
              <p className="text-gray-900 dark:text-white">{payoutDetail.product.productName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Product ID</label>
              <p className="text-gray-900 dark:text-white">{payoutDetail.product.id}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Details</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</label>
              <p className="text-gray-900 dark:text-white">{payoutDetail.orderDetails.orderId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
              <p className="text-gray-900 dark:text-white">{payoutDetail.orderDetails.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</label>
              <p className="text-gray-900 dark:text-white">₹{payoutDetail.orderDetails.price}</p>
            </div>
            {payoutDetail.orderDetails.type === 'RENT' && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Rent From</label>
                  <p className="text-gray-900 dark:text-white">
                    {helpers.formatDate(payoutDetail.orderDetails.rentFrom)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Rent To</label>
                  <p className="text-gray-900 dark:text-white">
                    {helpers.formatDate(payoutDetail.orderDetails.rentTo)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payout Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payout Details</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Earning ID</label>
              <p className="text-gray-900 dark:text-white">{payoutDetail.earningId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earning Amount</label>
              <p className="text-gray-900 dark:text-white">₹{payoutDetail.totalEarningAmount}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Paid</label>
              <p className="text-gray-900 dark:text-white">₹{payoutDetail.totalPaidByAdmin}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining Amount</label>
              <p className="text-gray-900 dark:text-white">₹{payoutDetail.remainingAmount}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(payoutDetail.status)}`}>
                {payoutDetail.status}
              </span>
            </div>
            {payoutDetail.remarks && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Remarks</label>
                <p className="text-gray-900 dark:text-white">{payoutDetail.remarks}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Transaction History</h2>
        {payoutDetail.transactions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Transaction ID</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Note</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {payoutDetail.transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {transaction.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white">
                      ₹{transaction.amount}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <button
                        onClick={() => {
                          setSelectedNote(transaction.note);
                          setIsNotePopupOpen(true);
                        }}
                        className="inline-flex items-center text-sm text-gray-900 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Note
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {helpers.formatDate(transaction.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Note Popup */}
      <ViewNotePopup
        isOpen={isNotePopupOpen}
        onClose={() => {
          setIsNotePopupOpen(false);
          setSelectedNote('');
        }}
        note={selectedNote}
      />
    </div>
  );
};

export default PayoutDetail;
