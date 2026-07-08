import quatationImg from "../../assets/new-images/quatation.pdf";

const ProjectQuotation = () => {

  return (
    <div className="rounded-lg bg-white p-5">
      {/* <img src={quatationImg} alt="" className="w-full h-auto" /> */}
      <iframe
  src={`${quatationImg}#toolbar=0&navpanes=0&scrollbar=0`}
  className="h-[600px] w-full rounded-lg border"
  title="PDF Preview"
/>
    </div>
  );
};

export default ProjectQuotation;
