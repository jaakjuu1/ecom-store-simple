import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });
  await wait(2000)

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getCustomerData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ]);

  return {
    userCount,
    avarageOrderValue:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  };
}

async function getProductData() {
  const [activeProductsCount, inactiveProductsCount] = await Promise.all([
    db.product.count({where: {isAvailableForPurchase: true}}),
    db.product.count({where: {isAvailableForPurchase: false}}),
  ]);

  return {
    activeProductsCount,
    inactiveProductsCount,
  };
}

export default async function AdminDashboard() {
  const [salesData, customerData, productData] = await Promise.all([
    getSalesData(),
    getCustomerData(),
    getProductData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={`${formatCurrency(salesData.amount)}`}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatNumber(customerData.userCount)} Users`}
        body={`${formatCurrency(customerData.avarageOrderValue)}`}
      />
      <DashboardCard
        title="Products"
        subtitle={`${formatNumber(productData.inactiveProductsCount)} Inactive`}
        body={`${formatNumber(productData.activeProductsCount)} Active`}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
