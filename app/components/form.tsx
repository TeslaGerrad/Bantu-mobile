" use client";
import * as Yup from "yup";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import CryptoJS from "crypto-js";
import { addDoc, collection } from "firebase/firestore";
import { app, db } from "../lib/firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Loader2 } from "lucide-react";

type Props = {
	field: {};
};

type ValuesProps = {
	case: String;
	description: String;
	incidentDate: String;
	location: String;
};

export default function FormFields() {
	const [image, setImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState("");
	const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
	const [videoUri, setVidoeUri] = useState("");
	const [vidUrl, setVidUrl] = useState("");
	const [imgUrl, setImgUrl] = useState("");
	const [msg, setMsg] = useState("");
	const [submiting, setSubmiting] = useState(false);

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
	const storage = getStorage(app);
	const colRef = collection(db, "reports");
	const storageRef = ref(storage, "files");
	const onSubmit = async (values: ValuesProps, helpers: any) => {
		setSubmiting(true);
		try {
			if (image) {
				const imageRef = ref(storageRef, `images/${image.name}`);
				await uploadBytes(imageRef, image);
				const imageUrl = await getDownloadURL(imageRef);
				setImgUrl(imageUrl);
			}

			// Upload video file if provided

			if (selectedVideo) {
				const videoRef = ref(storageRef, `videos/${selectedVideo.name}`);
				await uploadBytes(videoRef, selectedVideo);
				const videoUrl = await getDownloadURL(videoRef);
				setVidUrl(videoUrl);
			}

			const formData = {
				case: values.case,
				location: values.location,
				incidentDate: values.incidentDate,
				description: values.description,
				imageUrl: imgUrl || null,
				videoUrl: vidUrl || null,
			};
			await addDoc(colRef, formData).then((info) => {
				// console.log(info);
				setMsg("Successfully Submited your Report");
				helpers.resetForm();
				setPreviewUrl("");
				setVidoeUri("");
				setSubmiting(false);
			});
		} catch (error) {
			setMsg("An Error Occured Whild uploading the report");
			setSubmiting(false);
		}
	};
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
					<CardDescription>{msg}</CardDescription>
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
											<ErrorMessage name="case">
												{(msg) => (
													<h1 className="text-red-400 text-[10px]">{msg}</h1>
												)}
											</ErrorMessage>
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
											<ErrorMessage name="description">
												{(msg) => (
													<h1 className="text-red-400 text-[10px]">{msg}</h1>
												)}
											</ErrorMessage>
										</>
									);
								}}
							</Field>
							<Field name="incidentDate">
								{(props: Props) => {
									const { field } = props;
									return (
										<>
											<Label htmlFor="date">Incident Date</Label>
											<Input type="date" {...field} />
											<ErrorMessage name="incidentDate">
												{(msg) => (
													<h1 className="text-red-400 text-[10px]">{msg}</h1>
												)}
											</ErrorMessage>
										</>
									);
								}}
							</Field>
							<Field name="location">
								{(props: Props) => {
									const { field } = props;
									return (
										<>
											<Label htmlFor="location">Location </Label>
											<Input
												placeholder="lusaka, matero house no.12"
												{...field}
											/>
											<ErrorMessage name="location">
												{(msg) => (
													<h1 className="text-red-400 text-[10px]">{msg}</h1>
												)}
											</ErrorMessage>
										</>
									);
								}}
							</Field>
							<Button type="submit" variant={"outline"}>
								{submiting ? (
									<div className="flex gap-2">
										Submiting
										<Loader2 />
									</div>
								) : (
									"Submit"
								)}
							</Button>
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
						<Card>
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
