<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { isValidBip39Word, validateRecoveryPhraseWords, bip39Words } from '../utils/bip39-validator';

const bip39WordsRef = ref(bip39Words);

const recoveryPhrase = ref('');
const validationResults = ref<{ isValid: boolean; invalidWords: { index: number; word: string }[] }>({
  isValid: true,
  invalidWords: [],
});

const isDropdownOpen = ref(false);
const filteredSuggestions = ref<string[]>([]);

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void
}>();

const splitPhrases = computed(() => {
  return recoveryPhrase.value.trim().split(/\s+/).filter(word => word.trim() !== '');
});

const filterSuggestions = (input: string) => {
  const lastWord = input.split(/\s+/).pop() || '';
  if (!lastWord) {
    filteredSuggestions.value = [];
    isDropdownOpen.value = false;
    return;
  }
  filteredSuggestions.value = bip39WordsRef.value
      .filter(word => word.toLowerCase().startsWith(lastWord.toLowerCase()) && !splitPhrases.value.includes(word))
      .slice(0, 5);
  isDropdownOpen.value = filteredSuggestions.value.length > 0;
};

// Validate a single word
function validateWord(word: string) {
  if (!word.trim()) return true;
  return isValidBip39Word(word);
}

function duplicateWord(word: string) {
  if (!word.trim()) return false;
  return splitPhrases.value.filter(phrase => phrase.trim() === word.trim()).length > 1;
}

function validateAllPhrases() {
  validationResults.value = validateRecoveryPhraseWords(splitPhrases.value);
}

watch(recoveryPhrase, (newPhrase) => {
  filterSuggestions(newPhrase);
  emit("update:modelValue", splitPhrases.value);
  validateAllPhrases();
});

// Handle selection of suggestion
function selectSuggestion(suggestion: string) {
  const words = recoveryPhrase.value.trim().split(/\s+/);
  words.pop(); // Remove the partial last word
  recoveryPhrase.value = [...words, suggestion, ''].join(' '); // Add suggestion and space
  isDropdownOpen.value = false;
}

async function pasteWords() {
  const words = (await navigator.clipboard.readText()).toLowerCase().split(' ');
  const check = validateRecoveryPhraseWords(words);
  if (check.isValid) {
    recoveryPhrase.value = words.join(' ');
  } else {
    const result = check.invalidWords.map(res => `${res.index+1}: "${res.word}"`)
    useToast().add({
      color: "warning", title: "Paste warning",
      description: `You pasted ${result.length} invalid word(s): ${result.join(', ')}`
    })
    recoveryPhrase.value = words.join(' ');
  }
}

defineShortcuts({
  tab: {
    usingInput: true,
    handler: () => {
      if (isDropdownOpen.value && filteredSuggestions.value.length > 0) {
        selectSuggestion(filteredSuggestions.value[0]);
      }
    }
  },
});

// Initial validation
validateAllPhrases();
</script>

<template>
  <div>
    <div v-if="isDropdownOpen && filteredSuggestions.length > 0" class="w-full mt-1 grid grid-cols-5 space-x-2">
      <UBadge v-for="(suggestion, sIndex) in filteredSuggestions" :key="sIndex"
              class="cursor-pointer text-muted hover:text-highlighted"
              color="neutral"
              variant="subtle"
              @click="selectSuggestion(suggestion)">
        <template #leading v-if="sIndex == 0">
          <UKbd value="TAB" class="hidden md:flex" />
        </template>
        <span class="grow text-center">{{ suggestion }}</span>
      </UBadge>
    </div>

    <UTextarea
        v-model="recoveryPhrase"
        placeholder="Enter your recovery phrase words separated by spaces..."
        class="font-mono mt-4 w-full relative"
        color="neutral"
        variant="soft"
        :rows="4"
        @paste.prevent="pasteWords"
        @input="filterSuggestions($event.target.value)">
      <template #trailing>
        <span @click="pasteWords" class="absolute bottom-0 right-2 cursor-pointer">Paste</span>
      </template>
    </UTextarea>

    <div class="mt-4 text-xs text-muted">
      <p>Typically 12 (sometimes 18, 24) words separated by single spaces</p>
      <p>Current word count: <span :class="{'text-red-700': splitPhrases.length > 24}">{{ splitPhrases.length }}</span> </p>
    </div>

    <div class="mt-2 flex flex-wrap gap-2">
      <UBadge v-for="(word, idx) in splitPhrases" :key="idx"
              :color="!validateWord(word) || duplicateWord(word) ? 'error' : 'neutral'"
              variant="soft"
              class="font-medium">
        {{idx+1}}: {{ word }}
        <span v-if="duplicateWord(word)"> (DUPLICATE)</span>
        <span v-if="!validateWord(word)"> (INVALID)</span>
      </UBadge>
    </div>
  </div>
</template>