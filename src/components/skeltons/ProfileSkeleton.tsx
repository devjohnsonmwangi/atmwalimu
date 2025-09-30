// src/components/skeletons/ProfileSkeleton

export const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Skeleton for Profile Picture */}
            <div className="w-40 h-40 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
            
            {/* Skeleton for Form Details */}
            <div className="w-full mt-4 md:mt-0">
              {/* Name Skeleton */}
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 mb-6"></div>
              
              <div className="space-y-6">
                {/* Form Field 1 Skeleton */}
                <div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-1/4 mb-2"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
                </div>
                
                {/* Form Field 2 (Textarea) Skeleton */}
                <div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-1/4 mb-2"></div>
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
                </div>
              </div>
              
              {/* Button Skeleton */}
              <div className="flex justify-end mt-8">
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-md w-1/3 md:w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};