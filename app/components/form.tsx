" use client";
import * as Yup from "yup";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

type Props = {
	field: {};
};

export default function FormFields() {
	const [image, setImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState("");
	const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
	const [videoUri, setVidoeUri] = useState("");

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setImage(file);
			const preview = URL.createObjectURL(file);
			setPreviewUrl(preview);
		}
	};
	const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			setSelectedVideo(file);
			const uri = URL.createObjectURL(file);
			setVidoeUri(uri);
		}
	};
	const initialValues = {
		case: "",
		description: "",
		incidentDate: "",
		location: "",
	};
	const onSubmit = () => {};
	const validationSchema = Yup.object({
		case: Yup.string().required("Please Provide the case title"),
		description: Yup.string().required(
			"Please provide a description of the case"
		),
		incidentDate: Yup.date().required(
			"Provide the date when the incident happened"
		),
		location: Yup.string().required(
			"Please provide where the incident took place"
		),
	});
	return (
		<div className="flex justify-center items-center flex-col lg:h-screen  w-full">
			<Card className="lg:w-[750px] w-full lg:h-[500px] flex flex-col">
				<CardHeader>
					<CardTitle className="text-center">Ichalo Bantu</CardTitle>
				</CardHeader>
				<CardContent className="lg:flex flex flex-col lg:flex-row gap-10">
					<Formik
						onSubmit={onSubmit}
						validationSchema={validationSchema}
						initialValues={initialValues}>
						<Form className="flex flex-col gap-2 w-full">
							<Field name="case">
								{(props: Props) => {
									const { field } = props;
									return (
										<>
											<Label htmlFor="case">Case Type</Label>
											<Input placeholder="case type e.g murder" {...field} />
										</>
									);
								}}
							</Field>
							<Field name="description">
								{(props: Props) => {
									const { field } = props;
									return (
										<>
											<Label htmlFor="case">Description</Label>
											<Textarea placeholder="Case Description" {...field} />
										</>
									);
								}}
							</Field>
							<Field name="incidentDate">
								{(props: Props) => {
									const { field } = props;
									return (
										<>
											<Label htmlFor="case">Incident Date</Label>
											<Input type="date" {...field} />
										</>
									);
								}}
							</Field>
							<Field name="location">
								{(props: Props) => {
									const { field } = props;
									return (
										<>
											<Label htmlFor="case">Location </Label>
											<Input
												placeholder="lusaka, matero house no.12"
												{...field}
											/>
										</>
									);
								}}
							</Field>
							<Button variant={"outline"}>Submit</Button>
						</Form>
					</Formik>
					<div className="flex pt-5 lg:pt-0 flex-col gap-2">
						<Card className="h-[200px]">
							{previewUrl ? (
								<CardContent>
									<div className="h-full w-full py-4 rounded-lg">
										<Image
											src={previewUrl}
											width={200}
											height={100}
											objectFit="fit"
											alt="proof"
										/>
									</div>
								</CardContent>
							) : (
								<>
									<CardHeader>
										<CardTitle className="text-[18px]">
											Image if available
										</CardTitle>
									</CardHeader>
									<CardContent>
										<Input
											type="file"
											onChange={handleFileChange}
											accept="images/*"
										/>
									</CardContent>
								</>
							)}
						</Card>
						<Card className="h-[200px]">
							{videoUri ? (
								<video className="h-[200px] w-full" src={videoUri} controls />
							) : (
								<>
									<CardHeader>
										<CardTitle className="text-[18px]">
											Video if available
										</CardTitle>
									</CardHeader>
									<CardContent>
										<Input
											className="h-[200px]"
											onChange={handleVideoChange}
											accept="video/*"
											type="file"
										/>
									</CardContent>
								</>
							)}
						</Card>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
