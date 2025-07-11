# Base Form Components Documentation

## BaseSelect

### Basic Usage
```vue
<template>
  <BaseSelect
    v-model="selectedValue"
    :options="options"
    label="Choose an option"
    placeholder="Select..."
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedValue = ref('')
const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3', disabled: true }
]
</script>
```

### Props
- `modelValue`: Selected value(s)
- `options`: Array of options
- `label`: Label text
- `placeholder`: Placeholder text
- `size`: 'sm', 'md', 'lg', 'xl'
- `variant`: 'default', 'outline', 'filled', 'ghost'
- `color`: 'blue', 'green', 'red', 'yellow', 'purple', 'gray'
- `multiple`: Enable multiple selection
- `disabled`: Disable the select
- `required`: Mark as required
- `loading`: Show loading state
- `error`: Error message
- `success`: Success message
- `helperText`: Helper text
- `customClasses`: Custom CSS classes

### Multiple Selection
```vue
<BaseSelect
  v-model="selectedValues"
  :options="options"
  multiple
  label="Choose multiple options"
/>
```

### Custom Styling
```vue
<BaseSelect
  v-model="value"
  :options="options"
  variant="outline"
  color="green"
  size="lg"
  :custom-classes="{
    select: 'custom-select-class',
    label: 'custom-label-class'
  }"
/>
```

## BaseCheckbox

### Basic Usage
```vue
<template>
  <BaseCheckbox
    v-model="isChecked"
    label="Accept terms and conditions"
  />
</template>

<script setup>
import { ref } from 'vue'

const isChecked = ref(false)
</script>
```

### Multiple Checkboxes
```vue
<template>
  <BaseCheckbox
    v-model="selectedItems"
    value="item1"
    label="Item 1"
  />
  <BaseCheckbox
    v-model="selectedItems"
    value="item2"
    label="Item 2"
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedItems = ref([])
</script>
```

### Props
- `modelValue`: Checked state or array of selected values
- `value`: Value when used in array mode
- `label`: Label text
- `description`: Description text
- `labelPosition`: 'top', 'right'
- `size`: 'sm', 'md', 'lg', 'xl'
- `color`: Color theme
- `variant`: 'default', 'outline', 'solid'
- `shape`: 'square', 'rounded', 'circle'
- `disabled`: Disable checkbox
- `required`: Mark as required
- `indeterminate`: Indeterminate state
- `error`: Error message
- `success`: Success message
- `helperText`: Helper text

### Advanced Example
```vue
<BaseCheckbox
  v-model="agreement"
  label="I agree to the terms"
  description="By checking this box, you agree to our terms of service."
  color="green"
  size="lg"
  required
  :error="validationError"
>
  <template #default>
    <span class="text-sm text-gray-600">
      Additional content can go here
    </span>
  </template>
</BaseCheckbox>
```

## BaseRadioGroup

### Basic Usage
```vue
<template>
  <BaseRadioGroup
    v-model="selectedOption"
    :options="radioOptions"
    label="Choose your preference"
  />
</template>

<script setup>
import { ref } from 'vue'

const selectedOption = ref('')
const radioOptions = [
  { label: 'Option A', value: 'a', description: 'This is option A' },
  { label: 'Option B', value: 'b', description: 'This is option B' },
  { label: 'Option C', value: 'c', disabled: true }
]
</script>
```

### Props
- `modelValue`: Selected value
- `options`: Array of radio options
- `name`: Input name attribute
- `label`: Group label
- `direction`: 'vertical', 'horizontal', 'grid'
- `columns`: Number of columns for grid layout
- `size`: Size of radio buttons
- `color`: Color theme
- `disabled`: Disable all options
- `required`: Mark as required
- `error`: Error message
- `success`: Success message
- `helperText`: Helper text

### Layout Options
```vue
<!-- Horizontal layout -->
<BaseRadioGroup
  v-model="choice"
  :options="options"
  direction="horizontal"
  label="Pick one"
/>

<!-- Grid layout -->
<BaseRadioGroup
  v-model="choice"
  :options="options"
  direction="grid"
  :columns="3"
  label="Grid layout"
/>
```

## Features

### 🎨 **Customizable Appearance**
- Multiple sizes (sm, md, lg, xl)
- Various colors and themes
- Different variants and shapes
- Custom CSS classes support

### ♿ **Accessibility**
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Focus management

### 🔧 **Form Integration**
- v-model support
- Validation states (error, success)
- Helper text and descriptions
- Required field indicators

### 📱 **Responsive Design**
- Mobile-friendly touch targets
- Adaptive layouts
- Consistent spacing

### 🚀 **Advanced Features**
- Multiple selection support
- Indeterminate checkbox states
- Loading states
- Custom icons
- Slot support for custom content

## Examples

### Complete Form Example
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <BaseSelect
      v-model="form.category"
      :options="categories"
      label="Category"
      required
      :error="errors.category"
    />
    
    <BaseCheckbox
      v-model="form.features"
      value="feature1"
      label="Enable feature 1"
      description="This feature provides additional functionality"
    />
    
    <BaseRadioGroup
      v-model="form.priority"
      :options="priorities"
      label="Priority Level"
      direction="horizontal"
      required
      :error="errors.priority"
    />
    
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  category: '',
  features: [],
  priority: ''
})

const errors = ref({})

const categories = [
  { label: 'Technology', value: 'tech' },
  { label: 'Design', value: 'design' },
  { label: 'Marketing', value: 'marketing' }
]

const priorities = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]

const handleSubmit = () => {
  // Handle form submission
  console.log('Form data:', form)
}
</script>
```

## Styling and Theming

All components support extensive customization through:

1. **Built-in Props**: Size, color, variant, etc.
2. **Custom Classes**: Pass custom CSS classes via `customClasses` prop
3. **CSS Variables**: Override default colors and spacing
4. **Tailwind Classes**: All components use Tailwind CSS for easy customization

## Browser Support

- Chrome/Edge 88+
- Firefox 84+
- Safari 14+
- Mobile browsers with modern CSS support
