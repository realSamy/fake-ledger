// plugins/webusb.client.ts
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
    return {
        provide: {
            webusb: {
                requestDevice: async (filters?: USBDeviceFilter[]) => {
                    if (!navigator.usb) throw new Error('WebUSB not supported');
                    return await navigator.usb.requestDevice({ filters });
                },
            },
        },
    };
});