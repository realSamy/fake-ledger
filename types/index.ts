type DescriptionType = 'paragraph' | 'list';
type ImageType = 'image' | 'lottie';

interface DescriptionItem {
    title: string
    body: string
    badge: string
}

type DescriptionList = DescriptionItem[];

interface StepImg {
    src: string
    alt: string
    class?: string
}

export interface Step {
    sidebar: {
        logoImg: StepImg
        bodyImg: StepImg
        imgType: ImageType
    }
    main: {
        progress: {
            badge: number
            status: string
            value: number
        }
        body: {
            title: string
            description?: string | DescriptionList
            type?: DescriptionType
        },
        footer: {
            next: string
            previous: string
        }
    }
}