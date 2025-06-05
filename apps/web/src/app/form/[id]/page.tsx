interface FormPageProps {
  params: {
    id: string;
  };
}

export default async function FormPage({ params }: FormPageProps): Promise<JSX.Element> {
  const { id } = params;

  // TODO: Fetch form data using the ID
  // For now, return a basic page
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Form {id}</h1>
      <p>Form details will be displayed here.</p>
    </div>
  );
}
