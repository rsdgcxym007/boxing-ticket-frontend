import { useApi } from "./useApi";
import { useSingleToast } from "./useSingleToast";

export interface SeatRecommendation {
  seatId: string;
  row: string;
  seatNumber: number;
  confidence: number;
  reasons: string[];
  price: number;
  zone: string;
  userPreferenceMatch: number;
}

export interface PricingRecommendation {
  zone: string;
  currentPrice: number;
  recommendedPrice: number;
  priceChange: number;
  expectedDemand: number;
  revenueImpact: number;
  confidence: number;
}

export interface UserBehaviorPrediction {
  userId: string;
  preferredZones: string[];
  priceRange: {
    min: number;
    max: number;
  };
  bookingProbability: number;
  recommendedActions: string[];
  nextBookingWindow: string;
}

export interface PopularSeatAnalysis {
  zoneId: string;
  hotSpots: Array<{
    seatId: string;
    popularity: number;
    averageBookingTime: number;
  }>;
  trends: Array<{
    timeSlot: string;
    popularSeats: string[];
  }>;
}

export const useAI = () => {
  const { get } = useApi();
  const { showToast } = useSingleToast();

  /**
   * Seat Recommendations
   */
  const getSeatRecommendations = async (
    userId: string,
    zoneId: string,
    limit: number = 5
  ): Promise<SeatRecommendation[]> => {
    try {
      const response = await get(
        `/ai-recommendations/seats/${userId}/${zoneId}`,
        {
          query: { limit },
        }
      );
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถโหลดคำแนะนำที่นั่งได้: ${error.message}`);
      throw error;
    }
  };

  /**
   * Dynamic Pricing Recommendations
   */
  const getPricingRecommendations = async (
    zoneId: string,
    seatZone: string = "General"
  ): Promise<PricingRecommendation[]> => {
    try {
      const response = await get(`/ai-recommendations/pricing/${zoneId}`, {
        query: { seatZone },
      });
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถโหลดคำแนะนำราคาได้: ${error.message}`);
      throw error;
    }
  };

  /**
   * User Behavior Predictions
   */
  const getUserBehaviorPredictions = async (
    userId: string
  ): Promise<UserBehaviorPrediction> => {
    try {
      const response = await get(`/ai-recommendations/user-behavior/${userId}`);
      return response.data;
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดการพยากรณ์พฤติกรรมผู้ใช้ได้: ${error.message}`
      );
      throw error;
    }
  };

  /**
   * Popular Seat Analysis
   */
  const getPopularSeats = async (
    zoneId: string
  ): Promise<PopularSeatAnalysis> => {
    try {
      const response = await get(`/ai-recommendations/popular-seats/${zoneId}`);
      return response.data;
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดการวิเคราะห์ที่นั่งยอดนิยมได้: ${error.message}`
      );
      throw error;
    }
  };

  /**
   * Seat Selection Optimization
   */
  const getOptimalSeatSelection = async (preferences: {
    zoneId: string;
    budget: number;
    groupSize: number;
    preferredDistance?: "close" | "medium" | "far";
    accessibility?: boolean;
  }) => {
    try {
      const response = await get("/ai-recommendations/optimal-selection", {
        query: preferences,
      });
      return response.data;
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดการเลือกที่นั่งที่เหมาะสมได้: ${error.message}`
      );
      throw error;
    }
  };

  /**
   * Revenue Optimization Suggestions
   */
  const getRevenueOptimizationSuggestions = async (zoneId: string) => {
    try {
      const response = await get(
        `/ai-recommendations/revenue-optimization/${zoneId}`
      );
      return response.data;
    } catch (error: any) {
      showToast(
        "error",
        `ไม่สามารถโหลดคำแนะนำเพิ่มรายได้ได้: ${error.message}`
      );
      throw error;
    }
  };

  /**
   * Personalized Offers
   */
  const getPersonalizedOffers = async (userId: string) => {
    try {
      const response = await get(
        `/ai-recommendations/personalized-offers/${userId}`
      );
      return response.data;
    } catch (error: any) {
      showToast("error", `ไม่สามารถโหลดข้อเสนอส่วนบุคคลได้: ${error.message}`);
      throw error;
    }
  };

  return {
    // Core AI Features
    getSeatRecommendations,
    getPricingRecommendations,
    getUserBehaviorPredictions,
    getPopularSeats,

    // Advanced Features
    getOptimalSeatSelection,
    getRevenueOptimizationSuggestions,
    getPersonalizedOffers,
  };
};
