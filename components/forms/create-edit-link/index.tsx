import { useForm } from "react-hook-form";
import { FormData, createEditLinkSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Separator } from "@radix-ui/themes";
import { AndroidTargetingSection } from "./android-section";
import { IOSTargetingSection } from "./ios-section";
import { ExpirationDateSection } from "./expiration-date-section";
import { PasswordSection } from "./password-section";
import { GeoTargetingSection } from "./geo-section";
import { Link } from "@prisma/client";
import { getDateTimeLocal } from "@/lib/utils";
import FormTextInput from "@/components/shared/form-text-input";
import { Dices, Loader } from "lucide-react";
import { useRefinement } from "@/hooks/use-refinement";
import { usePrevious } from "@/hooks/use-previous";
import { classNames } from "@/components/utils";

const LINK_DOMAINS = process.env.NEXT_PUBLIC_APP_LINK_DOMAINS.split(',');

type Switch = "password" | "ios" | "android" | "geo" | "expiresAt";

type SwitchStatuses = {
  [key in Switch]: boolean;
};

type Props = {
  submitButton: ({ isSubmitting }: { isSubmitting: boolean }) => ReactNode;
  onSectionOpen: () => void;
  onFormHeightIncrease: () => void;
  onSave: (data: FormData) => Promise<void>;
  mode: "create" | "edit";
  link?: Link;
};

export function CreateEditLinkForm(props: Props) {
  const {
    onSectionOpen,
    onFormHeightIncrease,
    onSave,
    link,
    mode,
    submitButton,
  } = props;

  const isEditMode = mode === "edit";

  const uniqueKey = useRefinement(checkKeyToBeUnique, {
    debounce: 400,
  });

  const {
    handleSubmit,
    register,
    control,
    watch,
    resetField,
    formState: { errors, isValidating, isSubmitting },
    setValue,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(
      createEditLinkSchema.refine(
        ({ domain, key }) => {
          if (domain.length < 1 || key.length < 1 || isEditMode) {
            return true;
          }
          return uniqueKey({ domain, key });
        },
        {
          path: ["key"],
          message: "Key already exists in this domain",
        }
      )
    ),
    defaultValues: {
      ...link,
      domain: link?.domain || LINK_DOMAINS[0],
      password: link?.password ?? undefined,
      ios: link?.ios ?? undefined,
      android: link?.android ?? undefined,
      expiresAt: link?.expiresAt ? getDateTimeLocal(link.expiresAt) : undefined,
      geo: link?.geo
        ? Object.entries(link.geo).map(([country, url]) => ({
            country,
            url,
          }))
        : undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    onSave({
      ...data,
      // optional field must be excluded from the submit payload if its section is closed
      ios: switchStatuses.ios ? data.ios : undefined,
      android: switchStatuses.android ? data.android : undefined,
      password: switchStatuses.password ? data.password : undefined,
      expiresAt: switchStatuses.expiresAt ? data.expiresAt : undefined,
      geo: switchStatuses.geo ? data.geo : undefined,
    });
  };

  const [switchStatuses, setSwtichStatuses] = useState<SwitchStatuses>({
    android: !!link?.android,
    ios: !!link?.ios,
    password: !!link?.password,
    expiresAt: !!link?.expiresAt,
    geo: !!link?.geo,
  });

  const [loadingRandomKey, setLoadingRandomKey] = useState(false);

  const domain = watch("domain");
  const geoData = watch("geo");
  const geoLocationsNum = geoData?.length ?? 0;
  const prevGeoLocationsNum = usePrevious(geoLocationsNum);

  const generateKey = useCallback(async () => {
    setLoadingRandomKey(true);
    const newKey = await generateRandomKey(domain);
    newKey && setValue("key", newKey);
    setLoadingRandomKey(false);
  }, [domain, setValue]);

  useEffect(() => {
    if (prevGeoLocationsNum && geoLocationsNum > prevGeoLocationsNum) {
      onFormHeightIncrease();
    }
  }, [geoLocationsNum, prevGeoLocationsNum, onFormHeightIncrease]);

  return (
    <form
      className="flex flex-col bg-gray-50 pt-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-8">
        <div className="flex flex-col space-y-4 px-4 md:px-16">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-900" htmlFor="url">
              Destination URL
            </label>
            <FormTextInput
              {...register("url")}
              id="url"
              placeholder="https://github.com/unrenamed/weel"
              isError={!!errors?.url?.message}
            />
            {errors?.url?.message && (
              <p className="text-red-500 text-xs">{errors?.url?.message}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <label
                className="text-sm font-medium text-gray-900"
                htmlFor="key"
              >
                Short link
              </label>
              {!isEditMode && (
                <button
                  className="flex items-center space-x-2 text-sm text-gray-500 transition-all duration-75 hover:text-black active:scale-95"
                  onClick={() => {
                    if (!loadingRandomKey) {
                      clearErrors("key");
                      uniqueKey.invalidate();
                      generateKey();
                    }
                  }}
                  disabled={loadingRandomKey}
                  type="button"
                >
                  {loadingRandomKey ? (
                    <Loader className="h-4 w-4 animate-spin-slow" />
                  ) : (
                    <Dices className="h-4 w-4" />
                  )}
                  <p>{loadingRandomKey ? "Generating" : "Randomize"}</p>
                </button>
              )}
            </div>
            <div className="flex w-full">
              <select
                {...register("domain", { onChange: uniqueKey.invalidate })}
                id="domain"
                className="flex w-48 items-center justify-center rounded-l-md border-gray-300 bg-gray-50 pl-3 pr-7 text-sm text-gray-500 focus:border-gray-300 focus:outline-none focus:ring-0 border border-r-0"
                disabled={isEditMode}
              >
                {LINK_DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
              <div className="w-full relative">
                <FormTextInput
                  {...register("key", { onChange: uniqueKey.invalidate })}
                  id="key"
                  placeholder="github"
                  className="rounded-none rounded-r-md"
                  isError={!!errors?.key?.message}
                  disabled={isEditMode}
                />
                {isValidating && (
                  <span
                    className={classNames(
                      "absolute inset-y-center text-gray-500",
                      !!errors?.key?.message ? "right-10" : "right-3"
                    )}
                  >
                    <Loader className="h-4 w-4 animate-spin-slow" />
                  </span>
                )}
              </div>
            </div>
            {errors?.key?.message && (
              <p className="text-red-500 text-xs">{errors.key.message}</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between w-full space-x-2 px-4 md:px-16">
          <Separator className="bg-gray-300 h-px" size="4" />
          <span className="text-sm text-gray-500">Optional</span>
          <Separator className="bg-gray-300 h-px" size="4" />
        </div>
        <div className="flex flex-col space-y-4 px-4 md:px-16 pb-4">
          {!isEditMode && (
            <>
              <PasswordSection
                formProps={register("password")}
                error={errors?.password?.message}
                isOpen={switchStatuses.password}
                onOpen={() => {
                  setSwtichStatuses({ ...switchStatuses, password: true });
                  onSectionOpen();
                }}
                onClose={() => {
                  setSwtichStatuses({ ...switchStatuses, password: false });
                  resetField("password");
                }}
              />
              <Separator className="bg-gray-300 h-px" size="4" />
            </>
          )}
          <ExpirationDateSection
            formProps={register("expiresAt")}
            error={errors?.expiresAt?.message}
            isOpen={switchStatuses.expiresAt}
            onOpen={() => {
              setSwtichStatuses({ ...switchStatuses, expiresAt: true });
              onSectionOpen();
            }}
            onClose={() => {
              setSwtichStatuses({ ...switchStatuses, expiresAt: false });
              resetField("expiresAt");
            }}
          />
          <Separator className="bg-gray-300 h-px" size="4" />
          <IOSTargetingSection
            formProps={register("ios")}
            error={errors?.ios?.message}
            isOpen={switchStatuses.ios}
            onOpen={() => {
              setSwtichStatuses({ ...switchStatuses, ios: true });
              onSectionOpen();
            }}
            onClose={() => {
              setSwtichStatuses({ ...switchStatuses, ios: false });
              resetField("ios");
            }}
          />
          <Separator className="bg-gray-300 h-px" size="4" />
          <AndroidTargetingSection
            formProps={register("android")}
            error={errors?.android?.message}
            isOpen={switchStatuses.android}
            onOpen={() => {
              setSwtichStatuses({ ...switchStatuses, android: true });
              onSectionOpen();
            }}
            onClose={() => {
              setSwtichStatuses({ ...switchStatuses, android: false });
              resetField("android");
            }}
          />
          <Separator className="bg-gray-300 h-px" size="4" />
          <GeoTargetingSection
            {...{ control, register, errors }}
            isOpen={switchStatuses.geo}
            onOpen={() => {
              setSwtichStatuses({ ...switchStatuses, geo: true });
              onSectionOpen();
            }}
            onClose={() => {
              setSwtichStatuses({ ...switchStatuses, geo: false });
              resetField("geo");
            }}
          />
        </div>
      </div>
      {submitButton({ isSubmitting })}
    </form>
  );
}

const checkKeyToBeUnique = async (
  { domain, key }: { domain: string; key: string },
  { signal }: { signal?: AbortSignal } = {}
) => {
  const response = await fetch(
    `/api/links/exists?domain=${domain}&key=${key}`,
    {
      signal,
    }
  );
  if (!response.ok) {
    return true;
  }
  const exists = (await response.json()) as boolean;
  return !exists;
};

const generateRandomKey = async (domain: string) => {
  const response = await fetch(`/api/links/rand?domain=${domain}`);
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as string;
};
