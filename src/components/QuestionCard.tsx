import { formatDateString } from "@/lib/helperFunctions";
import React from "react";
import { Toaster, toast } from "sonner";
interface QuestionCardProps {
  // Define your props here
  category: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  difficulty?: string;
  createdAt?: Date | string | "None";
}

const QuestionCard: React.FC<QuestionCardProps> = (props) => {
  const {
    question,
    options,
    answer,
    explanation,
    category,
    difficulty,
    createdAt,
  } = props;
  const [isCorrect, setIsCorrect] = React.useState(false);
  const handleSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget.id;
    console.log(target);
    if (target === answer) {
      toast.success("Correct!");
      setIsCorrect(true);
    } else {
      toast.warning("Incorrect!");
    }
  };
  return (
    <>
      <div className=" gap-3 grid grid-rows-5 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="grid grid-cols-3 ">
          <span className="mb-2 text-sm font-bold tracking-tight text-gray-500">
            {`${category}`}
          </span>
          <span className="mb-2 text-sm font-bold tracking-tight text-gray-500">
            {`${difficulty || ""}`}
          </span>
          <span className="float-end text-xs">{`${
            formatDateString(createdAt as string) || ""
          }`}</span>
        </div>
        <div className="row-span-2">
          <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">
            {question}
          </h5>
          {isCorrect && (
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {explanation}
            </p>
          )}
        </div>

        <div className=" grid grid-cols-2 row-span-2 text-gray-500 dark:text-gray-400">
          {options.map((option, index) => (
            <button
              key={index}
              id={option}
              className={
                isCorrect && option === answer
                  ? "mb-2 border-2 border-yellow-300 rounded-lg mx-2 text-center bg-green-400"
                  : "mb-2 border-2 border-yellow-300 rounded-lg mx-2 text-center"
              }
              onClick={handleSelect}
            >
              {option}
            </button>
          ))}
        </div>
        <Toaster position="top-center" richColors={true} expand={false} />
      </div>
    </>
  );
};

export default QuestionCard;
