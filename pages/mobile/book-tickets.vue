<template>
  <div class="muay-thai-booking">
    <!-- Combat Arena Background -->
    <div class="arena-background">
      <div class="ring-lights"></div>
      <div class="smoke-effects"></div>
      <div class="fighter-shadows"></div>
    </div>

    <!-- Main Booking Arena -->
    <div class="booking-arena">
      <!-- Arena Header -->
      <header class="arena-header">
        <button class="back-btn combat-btn" @click="goBack">
          <Icon icon="mdi:arrow-left" class="back-icon" />
          <span class="combat-text">EXIT</span>
        </button>
        
        <div class="arena-title">
          <h1 class="main-title combat-text">
            🥊 FIGHT BOOKING 🥊
          </h1>
          <p class="arena-subtitle">SELECT YOUR BATTLE</p>
        </div>
      </header>

      <!-- Fight Selection -->
      <section class="fight-selection">
        <h2 class="section-title combat-text">
          <Icon icon="mdi:sword-cross" class="section-icon" />
          CHOOSE YOUR FIGHT
        </h2>
        
        <div class="fights-grid">
          <div 
            v-for="event in upcomingFights" 
            :key="event.id"
            class="fight-card"
            :class="{ active: selectedFight?.id === event.id }"
            @click="selectFight(event)"
          >
            <div class="fight-poster">
              <div class="poster-overlay">
                <Icon icon="mdi:fire" class="flame-icon" />
              </div>
              <img 
                :src="event.poster" 
                :alt="event.title"
                class="poster-image"
                @error="handleImageError"
              />
            </div>
            
            <div class="fight-info">
              <h3 class="fight-title combat-text">{{ event.title }}</h3>
              <div class="fight-details">
                <div class="detail-item">
                  <Icon icon="mdi:calendar" class="detail-icon" />
                  <span>{{ formatDate(event.date) }}</span>
                </div>
                <div class="detail-item">
                  <Icon icon="mdi:clock" class="detail-icon" />
                  <span>{{ event.time }}</span>
                </div>
                <div class="detail-item">
                  <Icon icon="mdi:stadium" class="detail-icon" />
                  <span>{{ event.venue }}</span>
                </div>
              </div>
              
              <div class="fight-price">
                <span class="price-label">Starting from</span>
                <span class="price-value combat-text">฿{{ event.startingPrice }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Arena Seating Map -->
      <section v-if="selectedFight" class="seating-section">
        <h2 class="section-title combat-text">
          <Icon icon="mdi:view-grid" class="section-icon" />
          ARENA SEATING
        </h2>
        
        <!-- Seating Legend -->
        <div class="seating-legend">
          <div class="legend-item available">
            <div class="legend-color"></div>
            <span>Available</span>
          </div>
          <div class="legend-item selected">
            <div class="legend-color"></div>
            <span>Selected</span>
          </div>
          <div class="legend-item occupied">
            <div class="legend-color"></div>
            <span>Occupied</span>
          </div>
          <div class="legend-item vip">
            <div class="legend-color"></div>
            <span>VIP</span>
          </div>
        </div>

        <!-- Arena Map -->
        <div class="arena-map">
          <!-- Ring -->
          <div class="boxing-ring">
            <div class="ring-center">
              <Icon icon="mdi:boxing-glove" class="ring-icon" />
              <span class="ring-text combat-text">RING</span>
            </div>
          </div>

          <!-- Seating Zones -->
          <div class="seating-zones">
            <!-- VIP Ringside -->
            <div class="zone vip-zone">
              <h4 class="zone-title combat-text">VIP RINGSIDE</h4>
              <div class="zone-price">฿{{ selectedFight.pricing.vip }}</div>
              <div class="seats-grid vip-seats">
                <button
                  v-for="seat in generateSeats('VIP', 20)"
                  :key="seat.id"
                  class="seat vip"
                  :class="{ 
                    selected: selectedSeats.includes(seat.id),
                    occupied: seat.occupied 
                  }"
                  @click="toggleSeat(seat)"
                  :disabled="seat.occupied"
                >
                  {{ seat.number }}
                </button>
              </div>
            </div>

            <!-- Premium -->
            <div class="zone premium-zone">
              <h4 class="zone-title combat-text">PREMIUM</h4>
              <div class="zone-price">฿{{ selectedFight.pricing.premium }}</div>
              <div class="seats-grid premium-seats">
                <button
                  v-for="seat in generateSeats('PREM', 40)"
                  :key="seat.id"
                  class="seat premium"
                  :class="{ 
                    selected: selectedSeats.includes(seat.id),
                    occupied: seat.occupied 
                  }"
                  @click="toggleSeat(seat)"
                  :disabled="seat.occupied"
                >
                  {{ seat.number }}
                </button>
              </div>
            </div>

            <!-- Standard -->
            <div class="zone standard-zone">
              <h4 class="zone-title combat-text">STANDARD</h4>
              <div class="zone-price">฿{{ selectedFight.pricing.standard }}</div>
              <div class="seats-grid standard-seats">
                <button
                  v-for="seat in generateSeats('STD', 60)"
                  :key="seat.id"
                  class="seat standard"
                  :class="{ 
                    selected: selectedSeats.includes(seat.id),
                    occupied: seat.occupied 
                  }"
                  @click="toggleSeat(seat)"
                  :disabled="seat.occupied"
                >
                  {{ seat.number }}
                </button>
              </div>
            </div>

            <!-- Standing -->
            <div class="zone standing-zone">
              <h4 class="zone-title combat-text">STANDING</h4>
              <div class="zone-price">฿{{ selectedFight.pricing.standing }}</div>
              <div class="standing-area">
                <div class="standing-counter">
                  <button 
                    class="counter-btn minus" 
                    @click="adjustStanding(-1)"
                    :disabled="standingTickets <= 0"
                  >
                    <Icon icon="mdi:minus" />
                  </button>
                  <span class="counter-value combat-text">{{ standingTickets }}</span>
                  <button 
                    class="counter-btn plus" 
                    @click="adjustStanding(1)"
                    :disabled="standingTickets >= 10"
                  >
                    <Icon icon="mdi:plus" />
                  </button>
                </div>
                <span class="standing-label">Tickets</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Booking Summary -->
      <section v-if="selectedFight && (selectedSeats.length > 0 || standingTickets > 0)" class="booking-summary">
        <div class="summary-card">
          <h3 class="summary-title combat-text">
            <Icon icon="mdi:receipt" class="summary-icon" />
            BATTLE SUMMARY
          </h3>
          
          <div class="summary-details">
            <div class="summary-row">
              <span class="label">Fight:</span>
              <span class="value">{{ selectedFight.title }}</span>
            </div>
            <div class="summary-row">
              <span class="label">Date:</span>
              <span class="value">{{ formatDate(selectedFight.date) }} at {{ selectedFight.time }}</span>
            </div>
            
            <!-- Selected Seats -->
            <div v-if="selectedSeats.length > 0" class="summary-row">
              <span class="label">Seats:</span>
              <span class="value">{{ selectedSeats.join(', ') }}</span>
            </div>
            
            <!-- Standing Tickets -->
            <div v-if="standingTickets > 0" class="summary-row">
              <span class="label">Standing:</span>
              <span class="value">{{ standingTickets }} tickets</span>
            </div>
          </div>
          
          <div class="price-breakdown">
            <div v-for="item in priceBreakdown" :key="item.type" class="price-item">
              <span class="price-label">{{ item.label }}</span>
              <span class="price-amount">฿{{ item.amount }}</span>
            </div>
            
            <div class="total-row">
              <span class="total-label combat-text">TOTAL</span>
              <span class="total-amount combat-text">฿{{ totalPrice }}</span>
            </div>
          </div>
          
          <button class="book-now-btn combat-action-btn" @click="proceedToPayment">
            <Icon icon="mdi:credit-card" class="btn-icon" />
            <span class="combat-text">SECURE YOUR SPOT</span>
            <Icon icon="mdi:fire" class="btn-icon" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// Reactive State
const selectedFight = ref(null)
const selectedSeats = ref([])
const standingTickets = ref(0)

// Mock upcoming fights data
const upcomingFights = ref([
  {
    id: 1,
    title: 'THUNDER vs LIGHTNING',
    subtitle: 'Championship Fight',
    date: new Date('2025-02-15'),
    time: '19:00',
    venue: 'Patong Arena',
    poster: 'https://images.unsplash.com/photo-1544737151-6e4b123de774?w=400&h=600&fit=crop',
    startingPrice: 500,
    pricing: {
      vip: 3000,
      premium: 1500,
      standard: 800,
      standing: 500
    }
  },
  {
    id: 2,
    title: 'DRAGON vs TIGER',
    subtitle: 'Main Event',
    date: new Date('2025-02-22'),
    time: '20:00',
    venue: 'Patong Arena',
    poster: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=600&fit=crop',
    startingPrice: 400,
    pricing: {
      vip: 2500,
      premium: 1200,
      standard: 600,
      standing: 400
    }
  }
])

// Computed Properties
const priceBreakdown = computed(() => {
  const breakdown = []
  
  if (selectedSeats.value.length > 0) {
    // Group seats by type and calculate prices
    const seatsByType = {}
    selectedSeats.value.forEach(seatId => {
      const type = seatId.split('-')[0]
      if (!seatsByType[type]) {
        seatsByType[type] = { count: 0, price: 0 }
      }
      seatsByType[type].count++
    })
    
    // Add prices for each seat type
    Object.keys(seatsByType).forEach(type => {
      const pricing = selectedFight.value.pricing
      let price = 0
      let label = ''
      
      switch(type) {
        case 'VIP':
          price = pricing.vip
          label = 'VIP Ringside'
          break
        case 'PREM':
          price = pricing.premium
          label = 'Premium'
          break
        case 'STD':
          price = pricing.standard
          label = 'Standard'
          break
      }
      
      seatsByType[type].price = price
      breakdown.push({
        type,
        label: `${label} (${seatsByType[type].count} seats)`,
        amount: price * seatsByType[type].count
      })
    })
  }
  
  if (standingTickets.value > 0) {
    breakdown.push({
      type: 'standing',
      label: `Standing (${standingTickets.value} tickets)`,
      amount: selectedFight.value.pricing.standing * standingTickets.value
    })
  }
  
  return breakdown
})

const totalPrice = computed(() => {
  return priceBreakdown.value.reduce((total, item) => total + item.amount, 0)
})

// Methods
const goBack = () => {
  router.back()
}

const selectFight = (fight) => {
  selectedFight.value = fight
  selectedSeats.value = []
  standingTickets.value = 0
}

const generateSeats = (prefix, count) => {
  const seats = []
  for (let i = 1; i <= count; i++) {
    const seatNumber = i.toString().padStart(2, '0')
    seats.push({
      id: `${prefix}-${seatNumber}`,
      number: seatNumber,
      occupied: Math.random() < 0.3 // 30% chance of being occupied
    })
  }
  return seats
}

const toggleSeat = (seat) => {
  if (seat.occupied) return
  
  const seatIndex = selectedSeats.value.indexOf(seat.id)
  if (seatIndex > -1) {
    selectedSeats.value.splice(seatIndex, 1)
  } else {
    selectedSeats.value.push(seat.id)
  }
}

const adjustStanding = (delta) => {
  const newValue = standingTickets.value + delta
  if (newValue >= 0 && newValue <= 10) {
    standingTickets.value = newValue
  }
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/400x600/1a1a1a/ffffff?text=Fight+Poster'
}

const proceedToPayment = () => {
  // Mock booking process
  const bookingData = {
    fight: selectedFight.value,
    seats: selectedSeats.value,
    standingTickets: standingTickets.value,
    total: totalPrice.value
  }
  
  console.log('Proceeding to payment with:', bookingData)
  
  // Navigate to payment or show success
  alert(`🥊 Booking confirmed!\nTotal: ฿${totalPrice.value}\nProceeding to payment...`)
}

// Page Meta
definePageMeta({
  layout: 'mobile',
  middleware: 'auth'
})
</script>

<style scoped>
@import url('/assets/css/muay-thai-theme.css');

/* Arena Background */
.muay-thai-booking {
  min-height: 100vh;
  background: var(--bg-dark);
  position: relative;
  overflow-x: hidden;
}

.arena-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.ring-lights {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(225, 6, 0, 0.1) 0%, transparent 50%);
  animation: flickerLights 4s ease-in-out infinite alternate;
}

@keyframes flickerLights {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.smoke-effects {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at center bottom, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
  animation: smokeMove 6s ease-in-out infinite;
}

@keyframes smokeMove {
  0%, 100% { transform: translateY(0px); opacity: 0.3; }
  50% { transform: translateY(-15px); opacity: 0.5; }
}

.fighter-shadows {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(225, 6, 0, 0.03) 0%, 
    rgba(0, 0, 0, 0.97) 50%, 
    rgba(255, 215, 0, 0.03) 100%);
}

/* Main Content */
.booking-arena {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  padding: 1.5rem 1rem;
  max-width: 500px;
  margin: 0 auto;
}

/* Arena Header */
.arena-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(225, 6, 0, 0.2);
  border: 1px solid var(--primary-red);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--primary-red);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: var(--primary-red);
  color: white;
  transform: translateY(-2px);
}

.back-icon {
  font-size: 1.2rem;
}

.arena-title {
  text-align: center;
  flex: 1;
}

.main-title {
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--primary-red);
  margin: 0 0 0.25rem 0;
  text-shadow: 
    0 0 10px rgba(225, 6, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
}

.arena-subtitle {
  font-size: 0.9rem;
  color: var(--primary-gold);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
}

/* Section Styling */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-gold);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-icon {
  font-size: 1.3rem;
  color: var(--primary-red);
}

/* Fight Selection */
.fight-selection {
  margin-bottom: 2rem;
}

.fights-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.fight-card {
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.fight-card:hover {
  border-color: var(--primary-red);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(225, 6, 0, 0.3);
}

.fight-card.active {
  border-color: var(--primary-red);
  background: rgba(225, 6, 0, 0.1);
  box-shadow: 0 0 20px rgba(225, 6, 0, 0.3);
}

.fight-poster {
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.flame-icon {
  font-size: 2rem;
  color: var(--primary-gold);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fight-card:hover .flame-icon {
  opacity: 1;
  animation: combatGlow 1s ease-in-out infinite alternate;
}

.fight-info {
  color: var(--text-light);
}

.fight-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-red);
  margin: 0 0 0.75rem 0;
}

.fight-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.detail-icon {
  font-size: 1rem;
  color: var(--primary-gold);
}

.fight-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.price-value {
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--primary-gold);
}

/* Seating Section */
.seating-section {
  margin-bottom: 2rem;
}

.seating-legend {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-light);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-item.available .legend-color {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.legend-item.selected .legend-color {
  background: var(--primary-red);
}

.legend-item.occupied .legend-color {
  background: #6b7280;
}

.legend-item.vip .legend-color {
  background: var(--primary-gold);
}

/* Arena Map */
.arena-map {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid var(--primary-red);
  border-radius: 15px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.boxing-ring {
  background: linear-gradient(45deg, 
    rgba(225, 6, 0, 0.2), 
    rgba(255, 215, 0, 0.2));
  border: 2px solid var(--primary-gold);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.ring-center {
  text-align: center;
}

.ring-icon {
  font-size: 1.5rem;
  color: var(--primary-red);
  margin-bottom: 0.25rem;
}

.ring-text {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary-gold);
}

/* Seating Zones */
.seating-zones {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.zone {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
}

.zone-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary-gold);
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.zone-price {
  font-size: 0.8rem;
  color: var(--text-light);
  text-align: center;
  margin-bottom: 1rem;
}

.seats-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 0.25rem;
  justify-items: center;
}

.seat {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.2);
  color: var(--text-light);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.seat:hover:not(:disabled) {
  transform: scale(1.1);
}

.seat.vip {
  background: rgba(255, 215, 0, 0.3);
  border-color: var(--primary-gold);
}

.seat.premium {
  background: rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
}

.seat.standard {
  background: rgba(34, 197, 94, 0.3);
  border-color: #22c55e;
}

.seat.selected {
  background: var(--primary-red);
  color: white;
  transform: scale(1.1);
}

.seat:disabled {
  background: #6b7280;
  cursor: not-allowed;
  opacity: 0.5;
}

/* Standing Area */
.standing-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.standing-counter {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.counter-btn {
  width: 36px;
  height: 36px;
  border: 2px solid var(--primary-gold);
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.2);
  color: var(--primary-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.counter-btn:hover:not(:disabled) {
  background: var(--primary-gold);
  color: var(--bg-dark);
  transform: scale(1.1);
}

.counter-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.counter-value {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--text-light);
  min-width: 40px;
  text-align: center;
}

.standing-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Booking Summary */
.booking-summary {
  margin-bottom: 2rem;
}

.summary-card {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid var(--primary-gold);
  border-radius: 15px;
  padding: 1.5rem;
  backdrop-filter: blur(15px);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-gold);
  margin: 0 0 1.5rem 0;
  text-align: center;
  justify-content: center;
}

.summary-icon {
  font-size: 1.3rem;
  color: var(--primary-red);
}

.summary-details {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.summary-row .label {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}

.summary-row .value {
  color: var(--text-light);
  font-weight: 700;
}

.price-breakdown {
  border-top: 1px solid rgba(255, 215, 0, 0.3);
  padding-top: 1rem;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.price-label {
  color: rgba(255, 255, 255, 0.8);
}

.price-amount {
  color: var(--text-light);
  font-weight: 600;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid var(--primary-red);
  font-size: 1.1rem;
}

.total-label {
  color: var(--primary-gold);
  font-weight: 900;
}

.total-amount {
  color: var(--primary-red);
  font-weight: 900;
  font-size: 1.3rem;
}

/* Book Now Button */
.book-now-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--primary-red) 0%, #b91c1c 100%);
  border: 2px solid var(--primary-gold);
  border-radius: 12px;
  padding: 1.2rem 2rem;
  font-size: 1.1rem;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.book-now-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.book-now-btn:hover::before {
  left: 100%;
}

.book-now-btn:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 10px 30px rgba(225, 6, 0, 0.4),
    0 0 30px rgba(255, 215, 0, 0.3);
  border-color: var(--primary-red);
}

.book-now-btn:active {
  transform: translateY(-1px);
  animation: punchEffect 0.3s ease;
}

.btn-icon {
  font-size: 1.2rem;
  color: var(--primary-gold);
}

/* Combat Text Effect */
.combat-text {
  text-shadow: 
    0 0 5px currentColor,
    0 1px 2px rgba(0, 0, 0, 0.8);
}

/* Responsive Design */
@media (min-width: 480px) {
  .booking-arena {
    padding: 2rem 1.5rem;
  }
  
  .fights-grid {
    grid-template-columns: 1fr;
  }
  
  .seating-legend {
    gap: 1.5rem;
  }
  
  .seats-grid {
    grid-template-columns: repeat(12, 1fr);
  }
  
  .seat {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
}

@media (min-width: 768px) {
  .booking-arena {
    max-width: 700px;
  }
  
  .seats-grid {
    grid-template-columns: repeat(15, 1fr);
  }
}
</style>
