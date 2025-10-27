/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// TeacherCard.jsx
"use client";
import {
  Form,
  TextField,
  Button,
  FormGroup,
  Radio,
} from "mehul-form-validator-widget";

function SurveyFormContent({ teacherName }) {
  return (
    <>
      <FormGroup>
        <Radio
          name="rating"
          label="Overall Rating"
          options={[
            { value: "5", label: "⭐⭐⭐⭐⭐ Excellent" },
            { value: "4", label: "⭐⭐⭐⭐ Good" },
            { value: "3", label: "⭐⭐⭐ Average" },
            { value: "2", label: "⭐⭐ Below Average" },
            { value: "1", label: "⭐ Poor" },
          ]}
          required
        />
      </FormGroup>

      <FormGroup>
        <Radio
          name="teachingStyle"
          label="Teaching Style"
          options={[
            { value: "interactive", label: "Interactive & Engaging" },
            { value: "structured", label: "Well-Structured" },
            { value: "flexible", label: "Flexible & Adaptive" },
            { value: "traditional", label: "Traditional Approach" },
          ]}
          required
        />
      </FormGroup>

      <FormGroup>
        <TextField
          name="comment"
          label="Additional Comments (Optional)"
          type="text"
          placeholder="Share your detailed feedback..."
        />
      </FormGroup>

      <Button
        type="submit"
        showSuccessModal={true}
        successMessage={`Thank you for reviewing ${teacherName}! Your feedback has been submitted.`}
        fullWidth
      >
        Submit Review
      </Button>
    </>
  );
}

export default function TeacherCard({ teacher, isExpanded, onToggle, onSubmitReview }) {
  return (
    <div className="bg-white border-3 border-stone-800 shadow-[4px_4px_0px_0px_#292524] mb-6">
      <div
        onClick={onToggle}
        className="p-6 cursor-pointer hover:bg-stone-50 transition-colors flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-stone-800 text-stone-50 flex items-center justify-center text-2xl">
            {teacher.emoji}
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-800">{teacher.name}</h3>
            <p className="text-sm text-stone-600">{teacher.subject}</p>
          </div>
        </div>
        <div className="text-2xl text-stone-800">
          {isExpanded ? "−" : "+"}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t-3 border-stone-800 p-6 bg-stone-50">
          <div className="mb-6">
            <p className="text-stone-700 mb-2"><strong>Department:</strong> {teacher.department}</p>
            <p className="text-stone-700 mb-2"><strong>Experience:</strong> {teacher.experience}</p>
            <p className="text-stone-700 mb-4"><strong>About:</strong> {teacher.about}</p>
          </div>

          <Form
            onSubmit={(values) => onSubmitReview(teacher.id, values)}
            initialValues={{
              rating: "",
              teachingStyle: "",
              comment: "",
            }}
            requiredFields={["rating", "teachingStyle"]}
          >
            <SurveyFormContent teacherName={teacher.name} />
          </Form>
        </div>
      )}
    </div>
  );
}