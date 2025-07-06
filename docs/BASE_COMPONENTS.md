# Base Components Documentation

## ✨ Overview
หลังจากลบ Nuxt UI ออกแล้ว เราได้สร้าง Base Components ที่เรียบง่าย ใช้งานง่าย และดูแลรักษาได้ง่าย

## 🎯 Available Components

### 1. BaseButton
```vue
<BaseButton 
  variant="primary" 
  size="md" 
  :disabled="false"
  :loading="false"
  icon="fas fa-user"
  @click="handleClick"
>
  Click Me
</BaseButton>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `loading`: boolean
- `icon`: string (FontAwesome class)

### 2. BaseInput
```vue
<BaseInput 
  v-model="value"
  label="ชื่อ"
  type="text"
  placeholder="กรอกชื่อ"
  :required="true"
  :error="errorMessage"
  hint="ข้อมูลช่วยเหลือ"
/>
```

**Props:**
- `modelValue`: string | number
- `label`: string
- `type`: string (default: 'text')
- `placeholder`: string
- `disabled`: boolean
- `required`: boolean
- `error`: string
- `hint`: string
- `size`: 'sm' | 'md' | 'lg'

### 3. BaseModal
```vue
<BaseModal 
  :isOpen="showModal"
  title="Modal Title"
  size="md"
  :persistent="false"
  @close="closeModal"
>
  <template #header>
    <h3>Custom Header</h3>
  </template>
  
  <div>Modal Content</div>
  
  <template #footer>
    <BaseButton @click="closeModal">Close</BaseButton>
  </template>
</BaseModal>
```

**Props:**
- `isOpen`: boolean
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `persistent`: boolean

### 4. BaseCard
```vue
<BaseCard 
  title="Card Title"
  variant="shadow"
  padding="md"
>
  <template #header>
    <h3>Custom Header</h3>
  </template>
  
  <template #actions>
    <BaseButton size="sm">Edit</BaseButton>
  </template>
  
  <div>Card Content</div>
  
  <template #footer>
    <p>Footer Content</p>
  </template>
</BaseCard>
```

**Props:**
- `title`: string
- `variant`: 'default' | 'bordered' | 'shadow' | 'elevated'
- `padding`: 'none' | 'sm' | 'md' | 'lg'

### 5. BaseAlert
```vue
<BaseAlert 
  :show="showAlert"
  type="success"
  title="Success!"
  message="Operation completed successfully"
  :dismissible="true"
  @close="hideAlert"
/>
```

**Props:**
- `show`: boolean
- `type`: 'info' | 'success' | 'warning' | 'error'
- `title`: string
- `message`: string
- `dismissible`: boolean

### 6. BaseSpinner
```vue
<BaseSpinner 
  size="lg"
  color="primary"
  text="Loading..."
/>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `color`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
- `text`: string

## 🚀 Usage Examples

### Form Example
```vue
<template>
  <BaseCard title="User Form" variant="shadow">
    <form @submit.prevent="handleSubmit">
      <BaseInput 
        v-model="form.name"
        label="Name"
        :required="true"
        :error="errors.name"
      />
      
      <BaseInput 
        v-model="form.email"
        label="Email"
        type="email"
        :required="true"
        :error="errors.email"
      />
      
      <div class="flex gap-2">
        <BaseButton 
          type="submit"
          variant="primary"
          :loading="isSubmitting"
        >
          Submit
        </BaseButton>
        
        <BaseButton 
          variant="secondary"
          @click="resetForm"
        >
          Reset
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BaseCard, BaseInput, BaseButton } from '~/components'

const form = ref({
  name: '',
  email: ''
})

const errors = ref({
  name: '',
  email: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // Submit logic here
    console.log('Form submitted:', form.value)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = { name: '', email: '' }
  errors.value = { name: '', email: '' }
}
</script>
```

### Dashboard Card Example
```vue
<template>
  <BaseCard title="Statistics" variant="elevated">
    <template #actions>
      <BaseButton size="sm" variant="secondary">
        <i class="fas fa-refresh mr-1"></i>
        Refresh
      </BaseButton>
    </template>
    
    <div class="grid grid-cols-2 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">1,234</div>
        <div class="text-sm text-gray-500">Total Orders</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">฿56,789</div>
        <div class="text-sm text-gray-500">Total Revenue</div>
      </div>
    </div>
  </BaseCard>
</template>
```

## 🎨 Styling Guide

### Color Palette
- **Primary**: Blue (#2563eb)
- **Secondary**: Gray (#6b7280)
- **Success**: Green (#16a34a)
- **Warning**: Yellow (#ca8a04)
- **Danger**: Red (#dc2626)

### Typography
- **Sizes**: text-sm, text-base, text-lg
- **Weights**: font-medium, font-semibold, font-bold
- **Font Family**: Prompt (Thai), Inter (English)

### Spacing
- **Padding**: p-2, p-4, p-6
- **Margins**: m-2, m-4, m-6
- **Gaps**: gap-2, gap-4, gap-6

## 🔧 Customization

### Extending Base Components
You can extend base components for specific use cases:

```vue
<!-- components/TicketButton.vue -->
<template>
  <BaseButton
    variant="primary"
    size="lg"
    :class="customClasses"
    v-bind="$attrs"
  >
    <i class="fas fa-ticket-alt mr-2"></i>
    <slot />
  </BaseButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from './base/BaseButton.vue'

const customClasses = computed(() => [
  'bg-gradient-to-r from-blue-500 to-purple-600',
  'hover:from-blue-600 hover:to-purple-700',
  'transform hover:scale-105 transition-all'
])
</script>
```

## 📦 Import Methods

### Individual Imports
```typescript
import BaseButton from '~/components/base/BaseButton.vue'
import BaseInput from '~/components/base/BaseInput.vue'
```

### Bulk Import
```typescript
import { BaseButton, BaseInput, BaseModal } from '~/components'
```

### Auto-import (Nuxt 3)
Components are auto-imported by Nuxt 3, so you can use them directly:
```vue
<template>
  <BaseButton>Click me</BaseButton>
</template>
```

## 🧪 Testing

### Unit Testing Example
```typescript
import { mount } from '@vue/test-utils'
import BaseButton from '~/components/base/BaseButton.vue'

describe('BaseButton', () => {
  it('renders with correct variant', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'primary' },
      slots: { default: 'Click me' }
    })
    
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('bg-blue-600')
  })
})
```

## 🚀 Performance Tips

1. **Use v-show for modals** instead of v-if when toggling frequently
2. **Lazy load components** for better initial load performance
3. **Use CSS transitions** for smooth animations
4. **Minimize prop drilling** by using provide/inject for deep components

## 🎯 Best Practices

1. **Consistent naming**: Use clear, descriptive names
2. **Props validation**: Always define prop types
3. **Accessibility**: Include proper ARIA attributes
4. **Documentation**: Document all props and slots
5. **Testing**: Write unit tests for all components

This documentation provides a complete guide for using the new Base Components system that replaces Nuxt UI.
