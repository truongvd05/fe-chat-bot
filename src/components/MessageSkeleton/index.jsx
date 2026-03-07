import { Skeleton } from "@/components/ui/skeleton"
function MessageSkeleton({ right = false }) {
  return (
    <div className={`flex ${right ? "justify-end" : "justify-start"}`}>
      <div className="flex items-end gap-2 max-w-[70%]">
        {!right && (
          <Skeleton className="w-8 h-8 rounded-full" />
        )}

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>

        {right && (
          <Skeleton className="w-8 h-8 rounded-full" />
        )}
      </div>
    </div>
  )
}

export default MessageSkeleton