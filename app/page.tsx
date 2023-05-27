"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useCallback, useState } from "react";
import { FinalResults, socialStatus, TaxationInfoForm } from "@/src/models";
import { Button, Checkbox, ConfigProvider, Divider, Input, Select } from "antd";
import { CalculatorOutlined } from "@ant-design/icons";
import { calculateTaxes } from "@/src/utils";

const disabledGroups = [
  "disabledGroupOne",
  "disabledGroupTwo",
  "disabledGroupTwoIndefinite",
  "disabledGroupThree",
  "disabledGroupThreeIndefinite",
];

export default function Home() {
  const { control, getValues, watch } = useForm<TaxationInfoForm>();
  const [isPensioner, setIsPensioner] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [currentFinalResults, setCurrentFinalResults] = useState<
    FinalResults | undefined
  >();

  const handleCalculate = useCallback(() => {
    setCurrentFinalResults({} as FinalResults);
    const results = calculateTaxes(getValues());
    setCurrentFinalResults(results);
  }, [getValues]);

  return (
    <main>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#ce1313",
          },
        }}
      >
        <div className="p-12">
          <div className="mb-4 text-4xl font-bold">
            Онлайн калькулятор для
            <span className="ml-3 text-red-primary">
              ТОО на упрощенном режиме ({watch("year") ?? 2023} г.)
            </span>
          </div>
          <div className="h-fit border border-solid">
            <div className="grid grid-cols-3">
              <div className="col-span-2 grid grid-cols-6 gap-y-4 p-10">
                <div className="flex items-center font-semibold">Доход</div>
                <div className="col-span-5 flex items-center">
                  <Controller
                    control={control}
                    rules={{ required: "Введите сумму" }}
                    defaultValue={0}
                    render={({ field }) => (
                      <Input
                        placeholder="Введите сумму..."
                        value={field?.value}
                        onChange={(event) => {
                          field.onChange(
                            event?.target.value
                              ?.replace(/\D/g, "")
                              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                          );
                        }}
                      />
                    )}
                    name="salary"
                  />
                </div>
                <div className="flex items-center font-semibold">Год</div>
                <div className="col-span-5 flex items-center">
                  <Controller
                    control={control}
                    defaultValue="2023"
                    render={({ field }) => (
                      <Select
                        defaultValue="2023"
                        options={[
                          { label: "2021", value: "2021" },
                          { label: "2022", value: "2022" },
                          { label: "2023", value: "2023" },
                        ]}
                        onChange={(event) => {
                          field.onChange(event);
                        }}
                      />
                    )}
                    name="year"
                  />
                </div>
                <div className="flex items-center font-semibold">Расчет за</div>
                <div className="col-span-5 flex">
                  <Controller
                    control={control}
                    name="isStaffMember"
                    defaultValue={true}
                    render={({ field }) => (
                      <>
                        <div className="mr-2">
                          <Checkbox
                            className="mr-1"
                            value={field?.value}
                            checked={!!field?.value}
                            onChange={(event) => {
                              field.onChange(event.target.checked);
                            }}
                          />
                          Сотрудника в штате
                        </div>
                        <div>
                          <Checkbox
                            className="mr-1"
                            value={field?.value}
                            checked={!field?.value}
                            onChange={(event) => {
                              field.onChange(!event.target.checked);
                            }}
                          />
                          ГПХ
                        </div>
                      </>
                    )}
                  />
                </div>
                <div className="flex items-center font-semibold">Вычеты</div>
                <div className="col-span-5 flex">
                  <div className="mr-2">
                    <Controller
                      defaultValue={true}
                      render={({ field }) => (
                        <>
                          <Checkbox
                            className="mr-1"
                            checked={field?.value}
                            onChange={(event) => {
                              field?.onChange(event.target.checked);
                            }}
                          />
                          Вычет 14 МРП
                        </>
                      )}
                      name="is14MRP"
                      control={control}
                    />
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="is882MRP"
                      defaultValue={false}
                      render={({ field }) => (
                        <>
                          <Checkbox
                            className="mr-1"
                            onChange={(event) => {
                              field?.onChange(event.target.checked);
                            }}
                          />{" "}
                          Вычет 882 МРП
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="flex items-center font-semibold">
                  Резидентство
                </div>
                <div className="col-span-5 flex">
                  <Controller
                    control={control}
                    name="isResident"
                    defaultValue={true}
                    render={({ field }) => (
                      <>
                        <div className="mr-2">
                          <Checkbox
                            className="mr-1"
                            value={field?.value}
                            checked={!!field?.value}
                            onChange={(event) => {
                              field.onChange(event.target.checked);
                            }}
                          />
                          Гражданин РК
                        </div>
                        <div>
                          <Checkbox
                            className="mr-1"
                            value={field?.value}
                            checked={!field?.value}
                            onChange={(event) => {
                              field.onChange(!event.target.checked);
                            }}
                          />
                          Иностранец
                        </div>
                      </>
                    )}
                  />
                </div>
                <div className="flex items-center font-semibold">
                  Социальные статусы
                </div>
                <Controller
                  control={control}
                  name="socialStatuses"
                  defaultValue={[]}
                  render={({ field }) => {
                    return (
                      <div className="col-span-5 grid grid-cols-2 gap-y-4">
                        <div className="flex items-center">
                          <Checkbox
                            onChange={(event) => {
                              setIsPensioner(event.target.checked);
                              if (event.target.checked) {
                                field.onChange([
                                  ...(field?.value as socialStatus[]),
                                  "pensionerByAge",
                                ]);
                              } else {
                                field.onChange([
                                  ...(field?.value as socialStatus[])?.filter(
                                    (item) =>
                                      item !== "pensionerByAge" &&
                                      item !== "pensionerOther"
                                  ),
                                ]);
                              }
                            }}
                          />
                          <div className="mx-2">Пенсионер</div>
                          <Select
                            options={[
                              { label: "По возрасту", value: "pensionerByAge" },
                              {
                                label: "Прочите группы",
                                value: "pensionerOther",
                              },
                            ]}
                            onChange={(value) => {
                              field.onChange([
                                ...(field.value as socialStatus[])?.filter(
                                  (item) =>
                                    item !== "pensionerByAge" &&
                                    item !== "pensionerOther"
                                ),
                                value,
                              ]);
                            }}
                            disabled={!isPensioner}
                            defaultValue="pensionerByAge"
                          />
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            onChange={(event) => {
                              setIsDisabled(event.target.checked);
                              if (event.target.checked) {
                                field.onChange([
                                  ...(field.value as socialStatus[]),
                                  "disabledGroupOne",
                                ]);
                              } else {
                                field.onChange([
                                  ...(field.value as socialStatus[])?.filter(
                                    (item) => !disabledGroups.includes(item)
                                  ),
                                ]);
                              }
                            }}
                          />
                          <div className="mx-2">Инвалид</div>
                          <Select
                            options={[
                              { label: "1 группа", value: "disabledGroupOne" },
                              { label: "2 группа", value: "disabledGroupTwo" },
                              {
                                label: "2 группа бессрочно",
                                value: "disabledGroupTwoIndefinite",
                              },
                              {
                                label: "3 группа",
                                value: "disabledGroupThree",
                              },
                              {
                                label: "3 группа бессрочно",
                                value: "dsiabledGroupThreeIndefinite",
                              },
                            ]}
                            onChange={(value) => {
                              field.onChange([
                                ...(field.value as socialStatus[])?.filter(
                                  (item) => !disabledGroups.includes(item)
                                ),
                                value,
                              ]);
                            }}
                            disabled={!isDisabled}
                            defaultValue="disabledGroupOne"
                          />
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            onChange={(event) => {
                              if (event.target.checked) {
                                field.onChange([
                                  ...(field.value as socialStatus[]),
                                  "OPPV",
                                ]);
                              } else {
                                field.onChange([
                                  ...(field.value as socialStatus[])?.filter(
                                    (item) => item !== "OPPV"
                                  ),
                                ]);
                              }
                            }}
                          />
                          <div className="mx-2">Получатель ОППВ</div>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            onChange={(event) => {
                              if (event.target.checked) {
                                field.onChange([
                                  ...(field.value as socialStatus[]),
                                  "multipleChildren",
                                ]);
                              } else {
                                field.onChange([
                                  ...(field.value as socialStatus[])?.filter(
                                    (item) => item !== "multipleChildren"
                                  ),
                                ]);
                              }
                            }}
                          />
                          <div className="mx-2">Многодетная мать</div>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            onChange={(event) => {
                              if (event.target.checked) {
                                field.onChange([
                                  ...(field.value as socialStatus[]),
                                  "student",
                                ]);
                              } else {
                                field.onChange([
                                  ...(field.value as socialStatus[])?.filter(
                                    (item) => item !== "student"
                                  ),
                                ]);
                              }
                            }}
                          />
                          <div className="mx-2">Студент</div>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            onChange={(event) => {
                              if (event.target.checked) {
                                field.onChange([
                                  ...(field.value as socialStatus[]),
                                  "astanaHubMFCA",
                                ]);
                              } else {
                                field.onChange([
                                  ...(field.value as socialStatus[])?.filter(
                                    (item) => item !== "astanaHubMFCA"
                                  ),
                                ]);
                              }
                            }}
                          />
                          <div className="mx-2">
                            Сотрудник участника Астана хаб/МФЦа
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
              <div className="flex flex-col items-center border-l p-10">
                {!!currentFinalResults ? (
                  <>
                    <div className="mb-8 text-3xl">ИТОГО</div>
                    <div className="w-full font-semibold text-text-secondary">
                      За счет работника
                    </div>
                    {currentFinalResults?.employeeTaxes?.map((item) => (
                      <React.Fragment key={item?.taxName}>
                        <div className="my-2 flex w-full justify-between text-lg">
                          <div>{item?.taxName}</div>
                          <div>
                            {String(Math.round(item?.taxValue)).replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              " "
                            )}{" "}
                            Тенге
                          </div>
                        </div>
                        <Divider className="m-0" />
                      </React.Fragment>
                    ))}
                    <div className="mt-4 w-full font-semibold text-text-secondary">
                      За счет работодателя
                    </div>
                    {currentFinalResults?.employerTaxes?.length > 0 &&
                      currentFinalResults?.employerTaxes?.map((item) => (
                        <React.Fragment key={item?.taxName}>
                          <div className="my-2 flex w-full justify-between text-lg">
                            <div>{item?.taxName}</div>
                            <div>
                              {String(Math.round(item?.taxValue)).replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                " "
                              )}{" "}
                              Тенге
                            </div>
                          </div>
                          <Divider className="m-0" />
                        </React.Fragment>
                      ))}
                    <div className="mt-8 w-full">
                      <div className="w-full text-left font-semibold text-text-secondary">
                        На руки
                      </div>
                      <div className="w-full text-right text-xl font-bold">
                        {String(
                          Math.round(currentFinalResults?.finalResult)
                        ).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                        Тенге
                      </div>
                      <Divider className="m-0" />
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <CalculatorOutlined className="text-9xl" />
                    <div className="text-center text-xl font-semibold">
                      Укажите параметры для поулчения результата
                    </div>
                  </div>
                )}
              </div>
              <div className="col-span-2 flex justify-center border-r pb-4">
                <Button onClick={handleCalculate}>Рассчитать</Button>
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </main>
  );
}
