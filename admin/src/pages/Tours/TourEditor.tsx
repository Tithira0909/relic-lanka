import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import ImageUpload from '../../components/ImageUpload';
import { Plus, Trash, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

// Types
type FormValues = {
  name: string;
  shortDescription: string;
  description: string;
  days: number;
  nights: number;
  heroImageUrl: string;
  isPublished: boolean;
  inclusion: { value: string }[]; // Wrap strings in objects for useFieldArray
  includedActivities: { value: string }[];
  seoTitle?: string;
  seoDescription?: string;
  itineraryDays: {
    dayNumber: number;
    title: string;
    routeText: string;
    details: string;
  }[];
  destinations: {
    id?: string;
    name: string;
    description: string;
    mapImageUrl?: string;
    routeImageUrl?: string;
    routeText?: string;
    sortOrder: number;
    images: { imageUrl: string; caption?: string; sortOrder: number }[];
  }[];
  experiences: {
    id?: string;
    title: string;
    description?: string;
    adventureItems: { value: string }[];
    sortOrder: number;
    images: { imageUrl: string; caption?: string; sortOrder: number }[];
  }[];
};

const TourEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [activeTab, setActiveTab] = useState(0);

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      name: '',
      shortDescription: '',
      description: '',
      days: 1,
      nights: 0,
      isPublished: false,
      inclusion: [],
      includedActivities: [],
      itineraryDays: [],
      destinations: [],
      experiences: []
    }
  });

  const { fields: inclusionFields, append: appendInc, remove: removeInc } = useFieldArray({ control, name: 'inclusion' });
  const { fields: activityFields, append: appendAct, remove: removeAct } = useFieldArray({ control, name: 'includedActivities' });
  const { fields: itineraryFields, append: appendItin, remove: removeItin } = useFieldArray({ control, name: 'itineraryDays' });
  const { fields: destinationFields, append: appendDest, remove: removeDest } = useFieldArray({ control, name: 'destinations' });
  const { fields: experienceFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experiences' });

  useEffect(() => {
    if (isEdit) {
      api.get(`/admin/tours/${id}`).then(res => {
        const data = res.data;
        // Transform arrays of strings to objects for useFieldArray
        data.inclusion = data.inclusion?.map((s: string) => ({ value: s })) || [];
        data.includedActivities = data.includedActivities?.map((s: string) => ({ value: s })) || [];

        // Transform adventureItems inside experiences
        if (data.experiences) {
          data.experiences = data.experiences.map((exp: any) => ({
            ...exp,
            adventureItems: exp.adventureItems?.map((s: string) => ({ value: s })) || []
          }));
        }

        reset(data);
      }).catch(console.error);
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform back to API format
      const payload = {
        ...data,
        days: Number(data.days),
        nights: Number(data.nights),
        inclusion: data.inclusion.map(i => i.value),
        includedActivities: data.includedActivities.map(i => i.value),
        itineraryDays: data.itineraryDays.map((d, idx) => ({ ...d, dayNumber: idx + 1, sortOrder: idx })),
        destinations: data.destinations.map((d, idx) => ({ ...d, sortOrder: idx })),
        experiences: data.experiences.map((e, idx) => ({
            ...e,
            sortOrder: idx,
            adventureItems: e.adventureItems.map(i => i.value)
        }))
      };

      if (isEdit) {
        await api.put(`/admin/tours/${id}`, payload);
      } else {
        await api.post('/admin/tours', payload);
      }
      navigate('/admin/tours');
    } catch (error) {
      alert('Failed to save tour');
      console.error(error);
    }
  };

  const tabs = ['Basic', 'Descriptions', 'Inclusions', 'Itinerary', 'Destinations', 'Experiences'];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Tour' : 'New Tour'}</h1>
        <div className="space-x-4">
          {isEdit && (
            <a href={`/api/tours/${id}`} target="_blank" rel="noreferrer" className="text-ocean hover:underline flex items-center inline-block">
               <ExternalLink className="w-4 h-4 mr-1"/> Preview JSON
            </a>
          )}
          <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-ocean text-white px-6 py-2 rounded shadow hover:bg-blue-700">
            {isSubmitting ? 'Saving...' : 'Save Tour'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b flex overflow-x-auto">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={clsx(
                'px-6 py-3 text-sm font-medium whitespace-nowrap focus:outline-none',
                activeTab === idx ? 'text-ocean border-b-2 border-ocean' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Tab 1: Basic */}
          {activeTab === 0 && (
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tour Name</label>
                <input {...register('name', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                {errors.name && <span className="text-red-500 text-xs">Required</span>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700">Days</label>
                   <input type="number" {...register('days')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700">Nights</label>
                   <input type="number" {...register('nights')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
              </div>
              <Controller
                control={control}
                name="heroImageUrl"
                render={({ field }) => (
                  <ImageUpload label="Hero Image" value={field.value} onChange={field.onChange} />
                )}
              />
              <div className="flex items-center">
                <input type="checkbox" {...register('isPublished')} className="h-4 w-4 text-ocean border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">Published</label>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">SEO</h3>
                 <div className="space-y-2">
                    <input placeholder="SEO Title" {...register('seoTitle')} className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" />
                    <input placeholder="SEO Description" {...register('seoDescription')} className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" />
                 </div>
              </div>
            </div>
          )}

          {/* Tab 2: Descriptions */}
          {activeTab === 1 && (
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-700">Short Description (Card)</label>
                <textarea {...register('shortDescription')} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Description</label>
                <textarea {...register('description')} rows={10} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
            </div>
          )}

          {/* Tab 3: Inclusions */}
          {activeTab === 2 && (
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions</label>
                {inclusionFields.map((field, index) => (
                  <div key={field.id} className="flex items-center mb-2">
                    <input {...register(`inclusion.${index}.value`)} className="flex-1 border border-gray-300 rounded-md p-1.5 text-sm" />
                    <button type="button" onClick={() => removeInc(index)} className="ml-2 text-red-500"><Trash className="w-4 h-4"/></button>
                  </div>
                ))}
                <button type="button" onClick={() => appendInc({ value: '' })} className="text-sm text-ocean flex items-center mt-2">
                  <Plus className="w-4 h-4 mr-1"/> Add Inclusion
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Included Activities</label>
                {activityFields.map((field, index) => (
                  <div key={field.id} className="flex items-center mb-2">
                    <input {...register(`includedActivities.${index}.value`)} className="flex-1 border border-gray-300 rounded-md p-1.5 text-sm" />
                    <button type="button" onClick={() => removeAct(index)} className="ml-2 text-red-500"><Trash className="w-4 h-4"/></button>
                  </div>
                ))}
                <button type="button" onClick={() => appendAct({ value: '' })} className="text-sm text-ocean flex items-center mt-2">
                  <Plus className="w-4 h-4 mr-1"/> Add Activity
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Itinerary */}
          {activeTab === 3 && (
            <div className="space-y-4">
              {itineraryFields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-md bg-gray-50 relative">
                  <div className="absolute top-4 right-4 text-gray-400 font-bold">Day {index + 1}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Title</label>
                      <input {...register(`itineraryDays.${index}.title`)} placeholder="e.g. Arrival" className="w-full border p-1.5 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Route</label>
                      <input {...register(`itineraryDays.${index}.routeText`)} placeholder="e.g. Airport > Negombo" className="w-full border p-1.5 rounded" />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-xs font-medium text-gray-500">Details</label>
                       <textarea {...register(`itineraryDays.${index}.details`)} rows={2} className="w-full border p-1.5 rounded" />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItin(index)} className="mt-2 text-red-500 text-xs flex items-center">
                    <Trash className="w-3 h-3 mr-1"/> Remove Day
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => appendItin({ dayNumber: 0, title: '', routeText: '', details: '' })} className="bg-ocean text-white px-4 py-2 rounded text-sm flex items-center">
                <Plus className="w-4 h-4 mr-2"/> Add Day
              </button>
            </div>
          )}

          {/* Tab 5: Destinations */}
          {activeTab === 4 && (
            <div className="space-y-6">
               {destinationFields.map((field, index) => (
                 <div key={field.id} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between mb-4">
                       <h3 className="font-bold">Destination {index + 1}</h3>
                       <button type="button" onClick={() => removeDest(index)} className="text-red-500"><Trash className="w-4 h-4"/></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <input {...register(`destinations.${index}.name`)} placeholder="Name (e.g. Sigiriya)" className="border p-2 rounded" />
                       <input {...register(`destinations.${index}.routeText`)} placeholder="Route Info" className="border p-2 rounded" />
                       <textarea {...register(`destinations.${index}.description`)} placeholder="Description" className="border p-2 rounded md:col-span-2" rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <Controller control={control} name={`destinations.${index}.mapImageUrl`} render={({field}) => <ImageUpload label="Map Image" value={field.value} onChange={field.onChange}/>} />
                        <Controller control={control} name={`destinations.${index}.routeImageUrl`} render={({field}) => <ImageUpload label="Route Image" value={field.value} onChange={field.onChange}/>} />
                    </div>

                    {/* Destination Images Nested Array */}
                    <DestinationImagesControl control={control} destIndex={index} />
                 </div>
               ))}
               <button type="button" onClick={() => appendDest({ name: '', description: '', sortOrder: 0, images: [] })} className="bg-ocean text-white px-4 py-2 rounded text-sm flex items-center">
                <Plus className="w-4 h-4 mr-2"/> Add Destination
              </button>
            </div>
          )}

           {/* Tab 6: Experiences */}
           {activeTab === 5 && (
            <div className="space-y-6">
               {experienceFields.map((field, index) => (
                 <div key={field.id} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between mb-4">
                       <h3 className="font-bold">Experience {index + 1}</h3>
                       <button type="button" onClick={() => removeExp(index)} className="text-red-500"><Trash className="w-4 h-4"/></button>
                    </div>
                    <div className="mb-4">
                       <input {...register(`experiences.${index}.title`)} placeholder="Title (e.g. Hiking)" className="border p-2 rounded w-full mb-2" />
                       <textarea {...register(`experiences.${index}.description`)} placeholder="Description" className="border p-2 rounded w-full" rows={2} />
                    </div>

                    {/* Adventure Items (Array of strings) */}
                    <AdventureItemsControl control={control} expIndex={index} />

                    {/* Experience Images */}
                    <ExperienceImagesControl control={control} expIndex={index} />
                 </div>
               ))}
               <button type="button" onClick={() => appendExp({ title: '', adventureItems: [], sortOrder: 0, images: [] })} className="bg-ocean text-white px-4 py-2 rounded text-sm flex items-center">
                <Plus className="w-4 h-4 mr-2"/> Add Experience
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for Destination Images
const DestinationImagesControl = ({ control, destIndex }: { control: any, destIndex: number }) => {
  const { fields, append, remove } = useFieldArray({ control, name: `destinations.${destIndex}.images` });
  return (
    <div className="bg-gray-50 p-3 rounded">
      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Gallery</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {fields.map((f, i) => (
          <div key={f.id} className="relative">
             <Controller control={control} name={`destinations.${destIndex}.images.${i}.imageUrl`} render={({field}) => (
               <ImageUpload value={field.value} onChange={field.onChange} className="w-full" />
             )} />
             <input {...control.register(`destinations.${destIndex}.images.${i}.caption`)} placeholder="Caption" className="mt-1 w-full text-xs border p-1" />
             <button type="button" onClick={() => remove(i)} className="text-red-500 text-xs mt-1">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ imageUrl: '', sortOrder: 0 })} className="border-2 border-dashed border-gray-300 rounded flex items-center justify-center h-24 hover:bg-gray-100">
           <Plus className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  )
}

// Helper component for Experience Images
const ExperienceImagesControl = ({ control, expIndex }: { control: any, expIndex: number }) => {
  const { fields, append, remove } = useFieldArray({ control, name: `experiences.${expIndex}.images` });
  return (
    <div className="bg-gray-50 p-3 rounded mt-4">
      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Gallery</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {fields.map((f, i) => (
          <div key={f.id} className="relative">
             <Controller control={control} name={`experiences.${expIndex}.images.${i}.imageUrl`} render={({field}) => (
               <ImageUpload value={field.value} onChange={field.onChange} className="w-full" />
             )} />
              <input {...control.register(`experiences.${expIndex}.images.${i}.caption`)} placeholder="Caption" className="mt-1 w-full text-xs border p-1" />
             <button type="button" onClick={() => remove(i)} className="text-red-500 text-xs mt-1">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ imageUrl: '', sortOrder: 0 })} className="border-2 border-dashed border-gray-300 rounded flex items-center justify-center h-24 hover:bg-gray-100">
           <Plus className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  )
}

// Helper for Adventure Items
const AdventureItemsControl = ({ control, expIndex }: { control: any, expIndex: number }) => {
   const { fields, append, remove } = useFieldArray({ control, name: `experiences.${expIndex}.adventureItems` });
   return (
     <div className="mb-4">
       <label className="block text-xs font-medium text-gray-700 mb-1">Adventure Items</label>
       <div className="flex flex-wrap gap-2">
         {fields.map((f, i) => (
           <div key={f.id} className="flex items-center bg-white border rounded-full px-3 py-1 text-sm">
              <input {...control.register(`experiences.${expIndex}.adventureItems.${i}.value`)} className="outline-none w-24 bg-transparent" />
              <button type="button" onClick={() => remove(i)} className="ml-1 text-red-500">&times;</button>
           </div>
         ))}
         <button type="button" onClick={() => append({ value: '' })} className="text-xs text-ocean border border-ocean rounded-full px-3 py-1 hover:bg-ocean hover:text-white transition">
           + Add Item
         </button>
       </div>
     </div>
   )
}

export default TourEditor;
