// components/index.ts
// Base Components Export
export { default as BaseButton } from "./base/BaseButton.vue";
export { default as BaseInput } from "./base/BaseInput.vue";
export { default as BaseModal } from "./base/BaseModal.vue";
export { default as BaseCard } from "./base/BaseCard.vue";
export { default as BaseAlert } from "./base/BaseAlert.vue";
export { default as BaseSpinner } from "./base/BaseSpinner.vue";

// New Form Components
export { default as BaseSelect } from "./base/BaseSelect.vue";
export { default as BaseCheckbox } from "./base/BaseCheckbox.vue";
export { default as BaseRadioGroup } from "./base/BaseRadioGroup.vue";

// Application Components Export
export { default as ActionButtons } from "./ActionButtons.vue";
export { default as BaseLoading } from "./BaseLoading.vue";
export { default as BoxingIntroVideo } from "./BoxingIntroVideo.vue";
export { default as Contact } from "./Contact.vue";
export { default as DatePicker } from "./DatePicker.vue";
export { default as Footer } from "./Footer.vue";
export { default as HeroBanner } from "./HeroBanner.vue";
export { default as Navbar } from "./Navbar.vue";
export { default as PaymentModal } from "./PaymentModal.vue";
export { default as SeatIcon } from "./SeatIcon.vue";
export { default as SeatLegend } from "./SeatLegend.vue";
export { default as TicketCard } from "./TicketCard.vue";
export { default as TicketDisplay } from "./TicketDisplay.vue";
export { default as StandingTicketModal } from "./StandingTicketModal.vue";
export { default as StadiumZoneSelector } from "./StadiumZoneSelector.vue";
export { default as SummaryModal } from "./SummaryModal.vue";
// Component Types Re-export
export type {
  BaseButtonProps,
  BaseInputProps,
  BaseModalProps,
  BaseCardProps,
  BaseAlertProps,
  BaseSpinnerProps,
} from "../types/components";
