
import React, { useEffect } from 'react';
import Sidebar from '../../Common/SideBar/sidebar';
import Navbar from '../../Common/Navbar/navbar';
import { getData, postData } from '../../Common/APIs/api';
import { toastSuccess } from '../../../Services/toast.service';
import { useForm, useFieldArray } from 'react-hook-form';

const ProductInfo = () => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      products: []
    }
  });

  const { fields, replace } = useFieldArray({
    control,
    name: 'products'
  });

  useEffect(() => {
    getProductAPI();
  }, []);

  const getProductAPI = async () => {
    const endpoint = 'gauswarnGetAllProduct';
    try {
      const response = await getData(endpoint);
      if (response?.success) {
        replace(response.products || []);
      }
    } catch (error) {
      console.log('API error: ', error);
    }
  };

  const updateProduct = async (index) => {
    const allData = getValues(); // get form values
    const product = allData.products[index]; // get updated product

    const payload = {
      product_id: product.product_id,
      product_price: product.product_price,
      product_purchase_price: product.product_purchase_price,
      product_del_price: product.product_del_price,
      product_weight: product.product_weight
    };

    const endpoint = '/updateGauswarnProductById'; 
    try {
      const response = await postData(endpoint, payload);
      if (response?.data?.success) {
        toastSuccess(response.data.message || 'Product updated successfully!');
       await getProductAPI();
      } else {
        console.error("Update failed:", response);
      }
    } catch (error) {
      console.log('Update error:', error);
    }
  };

  return (
    <div className="container-fluid px-4 gauswarn-bg-color min-vh-100">
      <Navbar />
      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>
        <div className="col-lg-10 px-lg-5">
          <div className="row g-0">
            <div className="col-12 px-2 px-sm-3 py-3">
              <div className="card w-100 shadow-sm rounded-3 no-mobile-margin">
                <div className="card-header bg-light-green text-dark-green fs-5">
                  Product Information
                </div>

                <form className="card-body row g-4">
                  {fields.map((item, index) => (
                    <React.Fragment key={item.id} >
                      {/* Product Weight - Disabled */}
                      <div className="col-md-6">
                        <label className="form-label">Product Weight</label>
                        <input
                          type="text"
                          className="form-control"
                           {...register(`products.${index}.product_weight`)}
                          // disabled
                        />
                      </div>

                      {/* Purchase Price */}
                      <div className="col-md-6">
                        <label className="form-label">Product Purchase Price</label>
                        <input
                          type="number"
                          className="form-control"
                          {...register(`products.${index}.product_purchase_price`)}
                        />
                      </div>

                      {/* Selling Price */}
                      <div className="col-md-6">
                        <label className="form-label">Product Selling Price</label>
                        <input
                          type="number"
                          className="form-control"
                          {...register(`products.${index}.product_price`)}
                        />
                      </div>

                      {/* MRP */}
                      <div className="col-md-6">
                        <label className="form-label">MRP (Maximum Retail Price)</label>
                        <input
                          type="number"
                          className="form-control"
                          {...register(`products.${index}.product_del_price`)}
                        />
                      </div>

                      {/* Save Button */}
                      <div className="col-md-12 pt-2 flex-wrap">
                        <button
                          type="button"
                          className="btn btn-save mx-auto"
                          onClick={() => updateProduct(index)}
                          
                        >
                          Save
                        </button>
                      </div>
                      <div className="border"></div>
                    </React.Fragment>
                  ))}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;




