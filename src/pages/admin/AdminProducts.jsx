import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/productSlice";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [preview, setPreview] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Upload image to Cloudinary
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("No file selected");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Foodimagespreset");

    try {
      setUploading(true);

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/duwrz3xdw/image/upload",
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await res.json();
      setUploadedImage(data.secure_url); // Save URL for form submit
      setPreview(data.secure_url);       // Show preview
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data) => {
    if (!uploadedImage) return toast.error("Please upload an image first");

    const newProduct = {
      name: data.product_name,
      price: parseFloat(data.product_price),
      count: parseInt(data.product_stock, 10) || 1,
      category: data.product_category || "General",
      image: uploadedImage, // Cloudinary URL
    };

    dispatch(addProduct(newProduct)); // Redux + localStorage update
    toast.success("✅ Product Added");

    reset();
    setPreview(null);
    setUploadedImage(null);
  };

  return (
    <div className="bg-background p-8">
      <section className="max-w-xl mx-auto p-6 bg-white border-8 border-amber-400 rounded-lg shadow-lg my-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Add Product</h2>

          <input
            {...register("product_name", { required: "Product name is required" })}
            type="text"
            placeholder="Product Name"
            className={`w-full border rounded-md p-2 ${errors.product_name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.product_name && <p className="text-red-600 text-sm">{errors.product_name.message}</p>}

          <input
            {...register("product_price", { required: "Price required", valueAsNumber: true, min: { value: 0.01, message: "Min price 0.01" } })}
            type="number"
            step="0.01"
            placeholder="Product Price"
            className={`w-full border rounded-md p-2 ${errors.product_price ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.product_price && <p className="text-red-600 text-sm">{errors.product_price.message}</p>}

          <input
            {...register("product_stock", { required: "Stock required", valueAsNumber: true, min: { value: 0, message: "Stock cannot be negative" } })}
            type="number"
            placeholder="Count"
            className={`w-full border rounded-md p-2 ${errors.product_stock ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.product_stock && <p className="text-red-600 text-sm">{errors.product_stock.message}</p>}

          <input
            {...register("product_category")}
            type="text"
            placeholder="Category (optional)"
            className="w-full border rounded-md p-2 border-gray-300"
          />

          <input type="file" accept="image/*" onChange={handleImageChange} />
          {uploading && <p className="text-blue-500 mt-2">Uploading image...</p>}
          {preview && <img src={preview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded" />}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition"
            disabled={uploading || !uploadedImage}
          >
            {uploading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminProducts;
