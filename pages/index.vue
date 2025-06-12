<template>
  <div>
    <BoxingIntroVideo />

    <AnimatedSection>
      <HeroBanner />
    </AnimatedSection>

    <AnimatedSection>
      <TicketCard />
    </AnimatedSection>

    <StadiumZoneSelector />
  </div>
</template>

<script setup>
import BoxingIntroVideo from "@/components/BoxingIntroVideo.vue";
import HeroBanner from "@/components/HeroBanner.vue";
import TicketCard from "@/components/TicketCard.vue";
import AnimatedSection from "@/components/AnimatedSection.vue";
</script>
