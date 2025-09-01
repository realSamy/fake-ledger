<script setup lang="ts">
import { ref, watch } from 'vue';
import type { TabsItem } from '@nuxt/ui';

// Define the tabs items
const items: TabsItem[] = [
  {
    label: "12 words",
    value: 12,
  },
  {
    label: "18 words",
    value: 18,
  },
  {
    label: "24 words",
    value: 24,
  },
];

const keyCount = ref(18);
const keyPhrases = ref<string[]>(Array(18).fill(''));

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void
}>()

watch(keyCount, (newCount) => {
  const currentPhrases = keyPhrases.value;
  if (currentPhrases.length !== newCount) {
    keyPhrases.value = Array(newCount).fill('').map((_, i) => currentPhrases[i] || '');

    emit("update:modelValue", keyPhrases.value)
  }
});
emit("update:modelValue", keyPhrases);
watch(keyPhrases, (newPhrases) => {
  emit("update:modelValue", newPhrases);
})

</script>

<template>
  <div>
    <UTabs :items="items" color="neutral" content class="font-mono" v-model="keyCount">
      <template #default="{ item }">
        <span class="p-1" :class="{'bg-black text-white': item.value == keyCount}">{{ item.value }}</span>
        <span> words</span>
      </template>
    </UTabs>

    <div class="grid grid-cols-2 md:grid-cols-4 space-y-2">
      <div v-for="index in keyCount" :key="index" class="flex justify-around items-center">
        <label :for="`word-${index}`" class="w-10 text-right">{{ index }}</label>
        <UInput
            v-model="keyPhrases[index - 1]"
            :id="`word-${index}`"
            variant="neutral"
            color="neutral"
            class="border-b border-b-neutral-500 font-mono"
            required
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-w-md {
  max-width: 28rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
</style>