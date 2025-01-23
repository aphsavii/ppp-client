import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { ApiResponse } from "@/types/Api";
import userService from "@/api/services/user.service";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardData } from "@/redux/userDash";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { DashboardData } from "@/types/dashboard";
import { rootState } from "@/redux/store";
import { PenSquare } from "lucide-react";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const dashboardData:DashboardData = useSelector((state: rootState) => state.userDash);
  const { toast } = useToast();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Return if we already have dashboard data
      if (dashboardData.userDetails.name) return;

      try {
        const response: ApiResponse = await userService.getUserDashBoard();
        dispatch(setDashboardData(response.data));
        toast({
          title: response.message,
          description: "Dashboard data loaded successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [dispatch, dashboardData.userDetails.name]);

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response: ApiResponse = await userService.updateAvatar(formData);
      const avatarUrl = response.data;
      dispatch(setDashboardData({ ...dashboardData, userDetails: { ...dashboardData.userDetails, avatar: avatarUrl } }));
      toast({
        title: "Success",
        description: "Avatar updated successfully",
        variant: "success",
      });
      setAvatarFile(null);
      setDialogOpen(false);
      
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
      setDialogOpen(false);
    } finally {
      setUploading(false);
    }
  };

  const recentTestsData = dashboardData.recentTests?.map((test) => ({
    name: test.test_name,
    score: (test.score / test.total_score) * 100,
    timestamp: new Date(
      parseInt(test.test_timestamp) * 1000
    ).toLocaleDateString(),
  })) || [];

  const topicAnalysisData = dashboardData.topicAnalysis?.map((topic) => ({
    name: topic.topic,
    accuracy: parseFloat(topic.accuracy),
    correct: parseInt(topic.correct_answers),
    incorrect: parseInt(topic.incorrect_answers),
    total: parseInt(topic.total_questions),
  })) || [];

  const statsData = [
    {
      name: "Tests Taken",
      value: parseInt(dashboardData.testStats?.total_tests_taken || "0"),
    },
    {
      name: "Average Score",
      value: parseFloat(dashboardData.testStats?.average_score || "0"),
    },
    {
      name: "Last Test Score", 
      value: dashboardData.lastTest ? 
        parseFloat(((dashboardData.lastTest.score / dashboardData.lastTest.total_score) * 100).toFixed(1)) :
        0,
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* User Profile Section */}
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <div className="cursor-pointer relative group">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={dashboardData.userDetails?.avatar} />
                  <AvatarFallback>{dashboardData.userDetails?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <PenSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Profile Picture</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
                <Button  onClick={handleAvatarUpload} disabled={!avatarFile || uploading}>
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <div>
            <h2 className="text-2xl font-bold">
              {dashboardData.userDetails?.name}
            </h2>
            <p className="text-gray-600">
              Reg No: {dashboardData.userDetails?.regno}
            </p>
            {dashboardData.userDetails?.trade && (
              <p className="text-gray-600">
                Trade: {dashboardData.userDetails.trade}
              </p>
            )}
            {dashboardData.userDetails?.batch && (
              <p className="text-gray-600">
                Batch: {dashboardData.userDetails.batch}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-600">{stat.name}</h3>
              <p className="text-3xl font-bold mt-2">
                {stat.value}
                {stat.name.includes("Score") ? "%" : ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Topic Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="correct" fill="#4CAF50" name="Correct Answers" />
              <Bar
                dataKey="incorrect"
                fill="#f44336"
                name="Incorrect Answers"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Tests Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tests Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recentTestsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 rounded shadow">
                        <p className="font-bold">{payload[0].payload.name}</p>
                        <p>Date: {payload[0].payload.timestamp}</p>
                        <p>Score: {typeof payload[0].value === 'number' ? payload[0].value.toFixed(1) : payload[0].value}%</p>

                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                name="Score (%)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
