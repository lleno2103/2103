
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", vendas: 1200, meta: 1000, produção: 1300 },
  { month: "Fev", vendas: 1800, meta: 1500, produção: 1700 },
  { month: "Mar", vendas: 1400, meta: 1500, produção: 1400 },
  { month: "Abr", vendas: 1900, meta: 1700, produção: 2000 },
  { month: "Mai", vendas: 2200, meta: 2000, produção: 2100 },
  { month: "Jun", vendas: 2100, meta: 2000, produção: 2000 },
];

const SalesChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Vendas e Produção</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vendas">
          <TabsList className="mb-4">
            <TabsTrigger value="vendas">Vendas</TabsTrigger>
            <TabsTrigger value="produção">Produção</TabsTrigger>
            <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
          </TabsList>
          <TabsContent value="vendas" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis
                  dataKey="month"
                  stroke="#868e96"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#868e96"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="vendas"
                  name="Vendas"
                  stroke="#343a40"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="meta"
                  name="Meta"
                  stroke="#868e96"
                  dot={{ r: 4 }}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="produção" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis
                  dataKey="month"
                  stroke="#868e96"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#868e96"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value} un`}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="produção"
                  name="Produção"
                  fill="#343a40"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="comparativo" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis
                  dataKey="month"
                  stroke="#868e96"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#868e96"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="vendas"
                  name="Vendas"
                  fill="#343a40"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="produção"
                  name="Produção"
                  fill="#868e96"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
