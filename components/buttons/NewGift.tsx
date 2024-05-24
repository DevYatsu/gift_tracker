"use client";

import { addNewGift } from "@/db/interactions";
import { GiftType } from "@/db/schema";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
  ModalBody,
  Input,
  ModalFooter,
  Textarea,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { z } from "zod";
import { useState } from "react";

const giftSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  recipient: z.string().min(2),
  currency: z.string().min(3),
  price: z.coerce.number().positive().gte(1),
  paidAmount: z.number().gte(0),
  userEmail: z.string().email(),
  createdTimestamp: z.number().int(),
  lastUpdatedTimestamp: z.number().nullable(),
  updatesIds: z.number().int().array(),
  imageUrl: z.string(),
});

type giftSchemaCheck = Partial<z.infer<typeof giftSchema>>;

export default function NewGiftButton() {
  const { data: session } = useSession();

  const [errors, setErrors] = useState({} as giftSchemaCheck);

  if (!session || !session.user || !session.user.email) {
    redirect("/login");
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button variant="bordered" onPress={onOpen}>
        Create new gift!
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <form
              action={async (formData) => {
                setErrors({});

                const gift = {
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  imageUrl: formData.get("imageUrl") as string,
                  recipient: formData.get("recipient") as string,
                  currency: formData.get("currency") as string,
                  price: parseInt(formData.get("price") as string),
                  paidAmount: 0.0,
                  userEmail: session.user!.email as string,
                  createdTimestamp: Date.now(),
                  lastUpdatedTimestamp: null,
                  updatesIds: [],
                };

                const result = await giftSchema.safeParseAsync(gift);

                if (result.success) {
                  onClose();
                  await addNewGift(result.data! as unknown as GiftType);
                  window.location.reload();
                  return;
                }

                setErrors(
                  result.error!.formErrors.fieldErrors as giftSchemaCheck
                );
              }}
            >
              <ModalHeader className="flex flex-col gap-1">
                Add Gift
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Recipient"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="This gift is for ?"
                  name="recipient"
                  isInvalid={!!errors.recipient}
                  errorMessage={errors.recipient ?? ""}
                  onInput={() => {
                    setErrors({
                      ...errors,
                      recipient: undefined,
                    });
                  }}
                />
                <Input
                  autoFocus
                  label="Name"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="A keybord..."
                  name="name"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name ?? ""}
                  onInput={() => {
                    setErrors({
                      ...errors,
                      name: undefined,
                    });
                  }}
                />
                <Input
                  variant="bordered"
                  label="Price"
                  placeholder="0.00"
                  labelPlacement="outside"
                  name="price"
                  isInvalid={!!errors.price}
                  errorMessage={errors.price ?? ""}
                  onInput={() => {
                    setErrors({
                      ...errors,
                      price: undefined,
                    });
                  }}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  endContent={
                    <div className="flex items-center">
                      <label className="sr-only" htmlFor="currency">
                        Currency
                      </label>
                      <select
                        className="outline-none border-0 bg-transparent text-default-400 text-small"
                        id="currency"
                        name="currency"
                      >
                        <option>EUR</option>
                        <option>USD</option>
                        <option>ARS</option>
                      </select>
                    </div>
                  }
                  type="number"
                />
                <Textarea
                  label="Description"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="this gift is a keybord"
                  name="description"
                  isInvalid={!!errors.description}
                  errorMessage={errors.description ?? ""}
                  onInput={() => {
                    setErrors({
                      ...errors,
                      description: undefined,
                    });
                  }}
                />
                <Input
                  autoFocus
                  label="Image URL"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="the keyboard image source..."
                  name="imageUrl"
                  onInput={() => {
                    setErrors({
                      imageUrl: undefined,
                      ...errors,
                    });
                  }}
                  isInvalid={!!errors.imageUrl}
                  errorMessage={errors.imageUrl ?? ""}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => {
                    setErrors({});
                    onClose();
                  }}
                >
                  Exit
                </Button>
                <Button
                  color="primary"
                  className="text-background"
                  type="submit"
                >
                  Add Gift
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
