import { getActiveFlashSales } from "@/apis/flashSales";
import showNotify from "@/utils/notify";
import {
  Title,
  Container,
  Text,
  Card,
  SimpleGrid,
  Skeleton,
  Badge,
} from "@mantine/core";
import { useState, useEffect, useMemo, useCallback } from "react";


// Define interfaces for type safety
interface FlashSaleItem {
  id: string;
  foodName: string;
  slug: string;
  foodPrice: string | null;
  discountedPrice?: string | null;
  productImage: string;
}

interface FlashSale {
  id: string;
  title: string;
  description: string;
  endDate: string;
  menuItems: FlashSaleItem[];
}

const FlashSalesProducts = () => {
  // State with proper typing
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [timers, setTimers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // Memoized countdown calculation
  const calculateCountdown = useCallback((endDate: string | Date) => {
    try {
      const end = new Date(endDate).getTime();
      const now = Date.now();
      const distance = end - now;

      if (distance <= 0) return "Expired";

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } catch (error) {
      console.error("Error in calculateCountdown:", error);
      return "Invalid Date";
    }
  }, []);

  // Fetch flash sales with flexible data handling
  useEffect(() => {
    let mounted = true;

    const fetchFlashSales = async () => {
      try {
        setLoading(true);
        const response = await getActiveFlashSales();
        if (mounted) {
          const data = response?.data;
          // Handle both array and single object responses
          const flashSalesData = Array.isArray(data)
            ? data
            : data
            ? [data]
            : [];
          setFlashSales(flashSalesData);
        }
      } catch (error) {
        console.error("Fetch Flash Sales Error:", error);
        showNotify("error", "Failed to fetch flash sales");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchFlashSales();
    return () => {
      mounted = false;
    };
  }, []);

  // Memoized timers update
  const updateTimers = useCallback(() => {
    const newTimers: { [key: string]: string } = {};
    flashSales.forEach((sale) => {
      if (sale.endDate) {
        newTimers[sale.id] = calculateCountdown(sale.endDate);
      }
    });
    return newTimers;
  }, [flashSales, calculateCountdown]);

  // Timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const newTimers = updateTimers();
        if (JSON.stringify(prev) !== JSON.stringify(newTimers)) {
          return newTimers;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [updateTimers]);

  // Memoized rendering of flash sales
  const renderedFlashSales = useMemo(() => {
    return flashSales.map((sale) => {
      const isExpired = timers[sale.id] === "Expired";
      return (
        <Card
          key={sale.id}
          shadow="md"
          padding="md"
          radius="lg"
          withBorder
          className="mb-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-b-2 border-babyPink"
          aria-labelledby={`sale-${sale.id}`}
        >
          <Card.Section className="bg-purpleText p-4 text-white rounded-t-lg flex justify-between items-center">
            <Badge
              color="#D9583E"
              variant="filled"
              size="lg"
              className="animate-pulse"
            >
              {sale?.title}
            </Badge>
            <div className="text-right">
              <Title
                order={2}
                id={`sale-${sale.id}`}
                className="text-xl md:text-2xl font-bold text-white"
              >
                {sale.title}
              </Title>
              {sale.description && (
                <Text className="mt-1 text-sm md:text-base opacity-90 text-white">
                  {sale.description}
                </Text>
              )}
              <Text className="mt-2 text-2xl font-semibold animate-pulse text-white">
                Time Remaining:{" "}
                {timers[sale.id] || calculateCountdown(sale.endDate)}
              </Text>
            </div>
          </Card.Section>
          <Card.Section>
            {/*<SimpleGrid*/}
            {/*  cols={{ base: 1, sm: 2, md: 3, lg: 4 }}*/}
            {/*  spacing="md"*/}
            {/*  className="p-4"*/}
            {/*>*/}
            {/*  {sale.menuItems?.length > 0 ? (*/}
            {/*    // sale.menuItems.map((item) => (*/}
            {/*    //   // <ProductCard*/}
            {/*    //   //   key={item.id}*/}
            {/*    //   //   product={item}*/}
            {/*    //   //   isExpired={isExpired}*/}
            {/*    //   // />*/}
            {/*    // ))*/}
            {/*  ) : (*/}
            {/*    <Text className="col-span-full text-center py-4 opacity-70">*/}
            {/*      No menu items available*/}
            {/*    </Text>*/}
            {/*  )}*/}
            {/*</SimpleGrid>*/}
          </Card.Section>
        </Card>
      );
    });
  }, [flashSales, timers, calculateCountdown]);

  return (
    <Container
  size="xl"
  className={flashSales.length > 0 ? "py-4 lg:py-12" : ""}
>
      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <Card
                key={index}
                shadow="md"
                padding="md"
                radius="lg"
                withBorder
                className="mb-8 border-b-2 border-babyPink"
              >
                <Card.Section>
                  <Skeleton
                    height={60}
                    radius="lg"
                    animate
                    className="animate-pulse"
                  />
                </Card.Section>
                <Card.Section>
                  <SimpleGrid
                    cols={{ base: 1, sm: 2 }}
                    spacing="md"
                    className="p-4"
                  >
                    <Skeleton
                      height={200}
                      radius="md"
                      animate
                      className="animate-pulse"
                    />
                    <Skeleton
                      height={200}
                      radius="md"
                      animate
                      className="animate-pulse"
                    />
                  </SimpleGrid>
                </Card.Section>
              </Card>
            ))}
        </SimpleGrid>
      ) : (
        renderedFlashSales
      )}
    </Container>
  );
};

export default FlashSalesProducts;
