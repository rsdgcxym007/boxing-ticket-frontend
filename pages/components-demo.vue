<template>
  <div class="p-8 space-y-12">
    <h1 class="text-3xl font-bold">Components Demo</h1>

    <!-- BaseSelect Demo -->
    <section>
      <h2 class="text-2xl font-semibold">BaseSelect</h2>
      <div class="space-y-6">
        <BaseSelect
          :options="['Option 1', 'Option 2', 'Option 3']"
          label="Default Select"
          placeholder="Select an option"
        />

        <BaseSelect
          :options="['Small', 'Medium', 'Large']"
          label="Select with Sizes"
          size="sm"
        />

        <BaseSelect
          :options="['Red', 'Green', 'Blue']"
          label="Select with Colors"
          color="red"
        />

        <BaseSelect
          :options="['Loading...']"
          label="Loading State"
          :loading="true"
        />

        <BaseSelect
          :options="['Option A', 'Option B']"
          label="Error State"
          :error="'This field is required'"
        />
      </div>
    </section>

    <!-- BaseCheckbox Demo -->
    <section>
      <h2 class="text-2xl font-semibold">BaseCheckbox</h2>
      <div class="space-y-6">
        <BaseCheckbox label="Default Checkbox" />

        <BaseCheckbox label="Checked by Default" :checked="true" />

        <BaseCheckbox label="Disabled Checkbox" :disabled="true" />

        <BaseCheckbox label="Indeterminate State" :indeterminate="true" />

        <BaseCheckbox label="Custom Label Position" labelPosition="left" />
      </div>
    </section>

    <!-- BaseRadioGroup Demo -->
    <section>
      <h2 class="text-2xl font-semibold">BaseRadioGroup</h2>
      <div class="space-y-6">
        <BaseRadioGroup
          :options="['Option 1', 'Option 2', 'Option 3']"
          label="Default Radio Group"
        />

        <BaseRadioGroup
          :options="['Vertical 1', 'Vertical 2']"
          label="Vertical Layout"
          layout="vertical"
        />

        <BaseRadioGroup
          :options="['Grid 1', 'Grid 2', 'Grid 3']"
          label="Grid Layout"
          layout="grid"
        />

        <BaseRadioGroup
          :options="['Disabled 1', 'Disabled 2']"
          label="Disabled Options"
          :disabled="true"
        />

        <BaseRadioGroup
          :options="['Option A', 'Option B']"
          label="With Descriptions"
          :descriptions="['Description A', 'Description B']"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { BaseSelect, BaseCheckbox, BaseRadioGroup } from "@/components";

export default {
  components: {
    BaseSelect,
    BaseCheckbox,
    BaseRadioGroup,
  },
};
</script>

<style scoped>
/* Add any custom styles for the demo page here */
</style>
