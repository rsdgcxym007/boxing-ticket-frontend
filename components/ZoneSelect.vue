<template>
  <div class="w-full">
    <label class="block text-sm font-semibold mb-1">{{ label }}</label>
    <Listbox v-model="model">
      <div class="relative">
        <ListboxButton
          class="relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left text-black border shadow focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <span class="block truncate">{{ getZoneLabel(model) }}</span>
        </ListboxButton>

        <Transition name="fade">
          <ListboxOptions
            class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 text-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <ListboxOption
              v-for="zone in props.options"
              :key="zone.value"
              :value="zone.value"
              v-slot="{ selected }"
              class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-gray-600"
            >
              <span
                class="block truncate"
                :class="selected ? 'font-bold text-primary' : ''"
              >
                {{ zone.label || "ทั้งหมด" }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
              >
                ✅
              </span>
            </ListboxOption>
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  </div>
</template>
<script setup>
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

const model = defineModel(); // <-- ใช้แทน props.modelValue

const props = defineProps({
  options: Array,
  label: {
    type: String,
    default: "เลือกโซน",
  },
});

function getZoneLabel(val) {
  const found = props.options?.find((z) => z.value === val);
  return found?.label || "ทั้งหมด";
}
</script>
