"use client";

import { GiftType, GiftUpdateType } from "@/db/schema";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
  ModalBody,
  Input,
  ModalFooter,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { z } from "zod";
import { PropsWithChildren, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { addGiftUpdate, deleteGift } from "@/db/interactions";

const UpdateSchema = z.object({
  by: z.string().min(2),
  amount: z.coerce.number().gt(0),
});

type UpdateType = z.infer<typeof UpdateSchema>;

type updateSchemaCheck = Partial<z.infer<typeof UpdateSchema>>;

export default function GiftInformationModal({
  gift,
  updates,
}: {
  gift: GiftType;
  updates: GiftUpdateType[];
}) {
  const { data: session } = useSession();

  if (!session || !session.user || !session.user.email) {
    redirect("/login");
  }

  const [errors, setErrors] = useState({} as updateSchemaCheck);
  const [displayForm, setDisplayForm] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div
      className="absolute top-0 bottom-0 h-full z-50 w-full"
      onClick={() => {
        onOpen();
      }}
    >
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader className="flex flex-col gap-1">
                {gift.name}
              </ModalHeader>
              <form
                action={async (formData) => {
                  setErrors({});

                  const giftUpdate = {
                    by: formData.get("by") as string,
                    amount: formData.get("amount") as string,
                    // _id will be add automatically by the db
                  };

                  const result = await UpdateSchema.safeParseAsync(giftUpdate);

                  if (result.success) {
                    await addGiftUpdate(gift, giftUpdate);
                    setDisplayForm(false);
                    window.location.reload();
                    return;
                  }

                  setErrors(
                    result.error!.formErrors.fieldErrors as updateSchemaCheck
                  );
                }}
              >
                <ModalBody>
                  <p className=" text-secondary-400">Description</p>
                  <p>{gift.description}</p>

                  <GiftInfo title="Price">
                    {gift.price} {gift.currency}
                  </GiftInfo>
                  <GiftInfo title="Paid Amount">
                    {gift.paidAmount} {gift.currency}
                  </GiftInfo>

                  <GiftInfo title="Created">
                    {new Date(gift.createdTimestamp).toLocaleString()}
                  </GiftInfo>

                  <GiftInfo title="Last Updated">
                    {gift.lastUpdatedTimestamp
                      ? new Date(gift.lastUpdatedTimestamp).toLocaleString()
                      : "Never"}
                  </GiftInfo>

                  <p className="text-secondary-400">Participations</p>

                  <Table aria-label="Gifts Participations table">
                    <TableHeader>
                      <TableColumn>NAME</TableColumn>
                      <TableColumn>AMOUNT</TableColumn>
                    </TableHeader>
                    {updates.length > 0 ? (
                      <TableBody>
                        {updates.map((update, i) => (
                          <TableRow key={i}>
                            <TableCell>{update.by}</TableCell>
                            <TableCell>
                              {update.amount} {gift.currency}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (
                      <TableBody>
                        <TableRow key="0">
                          <TableCell>None </TableCell>
                          <TableCell>None </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>

                  <Button
                    variant="bordered"
                    onPress={() => {
                      setDisplayForm(!displayForm);
                    }}
                  >
                    {displayForm ? "Close" : "Add gift participant"}
                  </Button>

                  {displayForm ? (
                    <>
                      <Input
                        autoFocus
                        label="Donator"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="The money was given by ?"
                        name="by"
                        isInvalid={!!errors.by}
                        errorMessage={errors.by ?? ""}
                        onInput={() => {
                          setErrors({
                            ...errors,
                            by: undefined,
                          });
                        }}
                      />
                      <Input
                        variant="bordered"
                        label="Amount Given"
                        placeholder="1.00"
                        labelPlacement="outside"
                        name="amount"
                        isInvalid={!!errors.amount}
                        errorMessage={errors.amount ?? ""}
                        onInput={() => {
                          setErrors({
                            ...errors,
                            amount: undefined,
                          });
                        }}
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">
                              $
                            </span>
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
                      <Button
                        color="primary"
                        className="text-background"
                        type="submit"
                      >
                        Add Participant
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
                </ModalBody>
              </form>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={async () => {
                    await deleteGift(gift._id);
                    window.location.reload();
                  }}
                >
                  Delete Gift
                </Button>
                <Button
                  color="warning"
                  variant="flat"
                  onPress={() => {
                    setErrors({});
                    onClose();
                  }}
                >
                  Exit
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function GiftInfo({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
      <p className="text-secondary-400">{title}</p>
      <p>{children}</p>
    </div>
  );
}
