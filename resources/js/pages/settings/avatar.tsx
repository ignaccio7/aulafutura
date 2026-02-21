import { useRef, useState, ChangeEvent } from 'react';

interface User {
    name: string;
    avatar?: string;
}

interface AvatarEditorProps {
    user: User;
}

export default function AvatarEditor({ user }: AvatarEditorProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string>(
        user.avatar ?? '/usuario.png'
    );

    const openFilePicker = (): void => {
        fileInputRef.current?.click();
    };

    const onImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
    };

    return (
        <section className="flex flex-col items-center gap-2">
            <div className="relative">
                <img
                    src={preview}
                    alt="Avatar"
                    className="h-[100px] w-[100px] rounded-full object-cover"
                />

                <button
                    type="button"
                    onClick={openFilePicker}
                    className="absolute bottom-0 right-0 rounded-full bg-neutral-800 px-2 py-1 text-xs text-white"
                >
                    ✎
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                />
            </div>

            <h2 className="text-lg font-semibold">{user.name}</h2>

            <span className="text-sm text-muted-foreground">
                Miembro desde 2021
            </span>
        </section>
    );
}
