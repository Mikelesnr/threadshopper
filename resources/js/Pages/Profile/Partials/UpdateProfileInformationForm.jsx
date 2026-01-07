import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    // Text-only form state
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            city: user.city || "",
            country: user.country || "",
        });

    const submitInfo = (e) => {
        e.preventDefault();
        console.log("Submitting profile info:", data);
        patch(route("profile.update.info"));
    };

    // Image-only form state
    const {
        data: imageData,
        setData: setImageData,
        post,
        errors: imageErrors,
        processing: imageProcessing,
        recentlySuccessful: imageSaved,
    } = useForm({
        profile_image: null,
    });

    const submitImage = (e) => {
        e.preventDefault();
        console.log("Submitting profile image:", imageData.profile_image);
        post(route("profile.update.image"), { forceFormData: true });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            {/* Text fields form */}
            <form onSubmit={submitInfo} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Phone" />
                    <TextInput
                        id="phone"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        autoComplete="tel"
                    />
                    <InputError className="mt-2" message={errors.phone} />
                </div>

                <div>
                    <InputLabel htmlFor="address" value="Address" />
                    <TextInput
                        id="address"
                        className="mt-1 block w-full"
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                        autoComplete="street-address"
                    />
                    <InputError className="mt-2" message={errors.address} />
                </div>

                <div>
                    <InputLabel htmlFor="city" value="City" />
                    <TextInput
                        id="city"
                        className="mt-1 block w-full"
                        value={data.city}
                        onChange={(e) => setData("city", e.target.value)}
                        autoComplete="address-level2"
                    />
                    <InputError className="mt-2" message={errors.city} />
                </div>

                <div>
                    <InputLabel htmlFor="country" value="Country" />
                    <TextInput
                        id="country"
                        className="mt-1 block w-full"
                        value={data.country}
                        onChange={(e) => setData("country", e.target.value)}
                        autoComplete="country-name"
                    />
                    <InputError className="mt-2" message={errors.country} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        Save Info
                    </PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Info Saved.</p>
                    </Transition>
                </div>
            </form>

            {/* Image upload form */}
            <form
                onSubmit={submitImage}
                className="mt-6 space-y-6"
                encType="multipart/form-data"
            >
                <div>
                    <InputLabel htmlFor="profile_image" value="Profile Image" />
                    <input
                        id="profile_image"
                        type="file"
                        onChange={(e) =>
                            setImageData("profile_image", e.target.files[0])
                        }
                    />
                    <InputError
                        className="mt-2"
                        message={imageErrors.profile_image}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={imageProcessing}>
                        Upload Image
                    </PrimaryButton>
                    <Transition
                        show={imageSaved}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Image Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
