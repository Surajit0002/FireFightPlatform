import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import TeamModal from "@/components/team-modal";
import PlayerModal from "@/components/player-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import {
  Users,
  Plus,
  Search,
  Crown,
  Trophy,
  TrendingUp,
  Edit,
  Share2,
  UserPlus,
  MoreVertical,
  Copy,
  Settings,
  LogOut,
  Target,
  Shield,
  Crosshair,
  Zap,
  Brain,
  Award,
  Calendar,
  MapPin,
  Star,
  QrCode,
  WhatsApp,
  X,
  Check,
  Clock,
  Gamepad2,
  Flame,
  ChevronRight,
  Activity,
  BarChart3,
  TrendingDown,
  AlertCircle,
  MessageSquare,
  Medal,
  ExternalLink,
  FileText,
  Gift,
  UserCheck,
  History,
  Eye,
  Filter,
  Download,
  Upload,
  Trash2,
  Link,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Rocket,
  Swords,
  Globe,
  Lock,
  Unlock,
  UserX,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info,
  Heart,
  Bookmark,
  Flag,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Bluetooth,
  Smartphone,
  Monitor,
  Headphones,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Mail,
  Send,
  MessageCircle,
  Bell,
  BellOff,
  Home,
  Menu,
  Search as SearchIcon,
  User,
  UserCircle,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Key,
  Shield as ShieldIcon,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MinusCircle,
  PlusCircle,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Move,
  CornerDownLeft,
  CornerDownRight,
  CornerUpLeft,
  CornerUpRight,
  Navigation,
  Navigation2,
  Compass,
  Map,
  MapPin as MapPinIcon,
  Locate,
  LocateFixed,
  LocateOff,
  Radar,
  Satellite,
  Layers,
  Layout,
  LayoutGrid,
  LayoutList,
  Sidebar,
  SidebarClose,
  SidebarOpen,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  PanelTopClose,
  PanelTopOpen,
  PanelBottomClose,
  PanelBottomOpen,
  Columns,
  Rows,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Pentagon,
  Octagon,
  Diamond,
  Heart as HeartIcon,
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  Tag,
  Tags,
  Hash,
  AtSign,
  Percent,
  DollarSign,
  Euro,
  Pound,
  Yen,
  IndianRupee,
  Bitcoin,
  Wallet,
  CreditCard,
  Banknote,
  Coins,
  PiggyBank,
  TrendingUpIcon,
  TrendingDownIcon,
  BarChart,
  LineChart,
  PieChart,
  Activity as ActivityIcon,
  Analytics,
  Calculator,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Timer,
  Stopwatch,
  Hourglass,
  Sunrise,
  Sunset,
  Sun as SunIcon,
  Moon as MoonIcon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
  Thermometer,
  Umbrella,
  Droplets,
  Snowflake,
  Zap as ZapIcon,
  FlashIcon,
  Bolt,
  Power,
  PowerOff,
  Plug,
  Plug2,
  Cable,
  Usb,
  HardDrive,
  Cpu,
  MemoryStick,
  Database,
  Server,
  Cloud,
  CloudOff,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Router,
  Antenna,
  Radio,
  Bluetooth as BluetoothIcon,
  Nfc,
  Rss,
  Podcast,
  Headphones as HeadphonesIcon,
  Speaker,
  Volume,
  Volume1,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Camera as CameraIcon,
  Video as VideoIcon,
  VideoOff as VideoOffIcon,
  Film,
  Clapperboard,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Repeat,
  Repeat1,
  Shuffle,
  ListMusic,
  Music,
  Music2,
  Music3,
  Music4,
  Radio as RadioIcon,
  Disc,
  Disc2,
  Disc3,
  Vinyl,
  Cassette,
  Cd,
  Dvd,
  Tape,
  Gamepad,
  Gamepad2 as Gamepad2Icon,
  Joystick,
  Dices,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Spade,
  Club,
  Diamond as DiamondIcon,
  Heart as HeartSuitIcon,
  Puzzle,
  Target as TargetIcon,
  Crosshair as CrosshairIcon,
  Scope,
  Sword,
  Swords as SwordsIcon,
  Shield as ShieldSuitIcon,
  Axe,
  Hammer,
  Wrench,
  Screwdriver,
  Drill,
  Saw,
  Scissors,
  Ruler,
  Compass as CompassIcon,
  Protractor,
  Triangler,
  Pen,
  PenTool,
  Pencil,
  Paintbrush,
  Paintbrush2,
  Palette,
  Pipette,
  Brush,
  Eraser,
  Highlighter,
  Marker,
  Crayon,
  Feather,
  Ink,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Superscript,
  Subscript,
  Quote,
  List,
  ListOrdered,
  ListChecks,
  ListTodo,
  CheckSquare,
  Square as SquareIcon,
  Circle as CircleIcon,
  Dot,
  Minus,
  Plus as PlusIcon,
  X as XIcon,
  Check as CheckIcon,
  CheckCheck,
  ChevronsUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronsLeftRight,
  ArrowBigUp,
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  ArrowUpDown,
  ArrowLeftRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowDownLeft,
  ArrowUpLeft,
  Move3d,
  MousePointer,
  MousePointer2,
  MousePointerClick,
  MousePointerSquare,
  MousePointerSquareDashed,
  Hand,
  HandMetal,
  Finger,
  Footprints,
  Eye as EyeIcon,
  EyeOff,
  Glasses,
  SunGlasses,
  Monocle,
  Telescope,
  Microscope,
  Binoculars,
  Magnifier,
  MagnifyingGlass,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Focus,
  Scan,
  ScanFace,
  ScanLine,
  ScanText,
  QrCode as QrCodeIcon,
  Barcode,
  Binary,
  Code,
  Code2,
  CodeXml,
  Braces,
  Brackets,
  FileCode,
  FileCode2,
  FileText as FileTextIcon,
  File,
  Files,
  Folder,
  FolderOpen,
  FolderClosed,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  FolderSearch,
  FolderArchive,
  FolderLock,
  FolderKey,
  FolderHeart,
  FolderStar,
  FolderTree,
  FolderRoot,
  FolderInput,
  FolderOutput,
  FolderSync,
  FolderClock,
  FolderEdit,
  FolderCog,
  FolderDown,
  FolderUp,
  Archive,
  ArchiveX,
  ArchiveRestore,
  Package,
  Package2,
  PackageOpen,
  PackageCheck,
  PackageX,
  PackagePlus,
  PackageMinus,
  PackageSearch,
  Box,
  Boxes,
  Container,
  Bookmark as BookmarkSuitIcon,
  BookmarkPlus,
  BookmarkMinus,
  BookmarkX,
  BookmarkCheck,
  BookOpen,
  BookOpenCheck,
  BookOpenText,
  BookCopy,
  BookDashed,
  BookDown,
  BookUp,
  BookMarked,
  BookText,
  BookType,
  BookUser,
  BookKey,
  BookLock,
  BookHeart,
  BookImage,
  BookA,
  Book,
  Library,
  GraduationCap,
  School,
  University,
  Building,
  Building2,
  Home as HomeIcon,
  House,
  Castle,
  Church,
  Hospital,
  Hotel,
  Store,
  Warehouse,
  Factory,
  Construction,
  Crane,
  Excavator,
  Bulldozer,
  Tractor,
  Truck,
  Van,
  Car,
  Taxi,
  Bus,
  Train,
  Subway,
  Tram,
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  Helicopter,
  Rocket as RocketIcon,
  Satellite as SatelliteIcon,
  Ship,
  Boat,
  Anchor,
  Sailboat,
  Ferry,
  Bike,
  Motorcycle,
  Scooter,
  Skateboard,
  Roller,
  Fuel,
  Gauge,
  Speedometer,
  Tachometer,
  Route,
  Navigation as NavigationIcon,
  Map as MapIcon,
  MapPin as MapPinSuitIcon,
  Compass as CompassSuitIcon,
  NavigationOff,
  MapOff,
  Signpost,
  Milestone,
  RoadSign,
  TrafficCone,
  Construction as ConstructionIcon,
  Barrier,
  Fence,
  Gate,
  Door,
  DoorOpen,
  DoorClosed,
  Key as KeyIcon,
  KeyRound,
  KeySquare,
  Lock as LockSuitIcon,
  LockOpen,
  LockKeyhole,
  LockKeyholeOpen,
  Unlock as UnlockSuitIcon,
  Safe,
  Vault,
  ShieldCheck as ShieldCheckIcon,
  ShieldAlert as ShieldAlertIcon,
  ShieldX as ShieldXIcon,
  ShieldOff,
  ShieldQuestion,
  ShieldEllipsis,
  ShieldMinus,
  ShieldPlus,
  Security,
  Fingerprint,
  Scan as ScanIcon,
  ScanFace as ScanFaceIcon,
  ScanLine as ScanLineIcon,
  ScanText as ScanTextIcon,
  ScanEye,
  ScanSearch,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  UserPlus as UserPlusIcon,
  UserMinus,
  UserSearch,
  UserCog,
  Users as UsersIcon,
  Users2,
  UserCircle as UserCircleIcon,
  UserCircle2,
  UserSquare,
  UserSquare2,
  UserRound,
  UserRoundCheck,
  UserRoundCog,
  UserRoundMinus,
  UserRoundPlus,
  UserRoundSearch,
  UserRoundX,
  Contact,
  Contact2,
  Contacts,
  PersonStanding,
  Baby,
  UserIcon,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  Surprised,
  Confused,
  Worried,
  Tired,
  Sleepy,
  Dizzy,
  Sick,
  Thinking,
  Relieved,
  Pleased,
  Disappointed,
  Sad,
  Crying,
  Grinning,
  Beaming,
  Winking,
  Kissing,
  Hugging,
  Neutral,
  Expressionless,
  Unamused,
  Rolling,
  Grimacing,
  Hushed,
  Flushed,
  Sleeping,
  Drooling,
  Sneezing,
  Nauseated,
  Vomiting,
  Exploding,
  Cowboy,
  Partying,
  Disguised,
  Nerd,
  Monocle as MonocleIcon,
  Sunglasses as SunglassesIcon,
  StarStruck,
  MindBlown,
  Shushing,
  Thinking2,
  Saluting,
  Handshake,
  Pray,
  Writing,
  Selfie,
  Flexed,
  Backhand,
  Pointing,
  Victory,
  Crossed,
  OpenHands,
  Palms,
  Clap,
  Raised,
  Thumb,
  Punch,
  Fist,
  Left,
  Right,
  Index,
  Middle,
  CallMe,
  Vulcan,
  Love,
  Metal,
  Ok,
  Pinching,
  Pinched,
  V,
  Sign,
  Horns,
  ILoveYou,
  Ear,
  Nose,
  Brain as BrainIcon,
  Tooth,
  Bone,
  Eyes,
  Tongue,
  Lips,
  Kiss,
  Footprint,
  Heart2,
  BrokenHeart,
  HeartHands,
  HeartOnFire,
  MendingHeart,
  GrowingHeart,
  BeatingHeart,
  RevolvingHearts,
  TwoHearts,
  Cupid,
  GiftHeart,
  HeartDecoration,
  PeaceSymbol,
  LatinCross,
  OrthoCross,
  StarAndCrescent,
  Om,
  WheelOfDharma,
  StarOfDavid,
  Menorah,
  YinYang,
  Atom,
  Fleur,
  Trident,
  NameBadge,
  Beginner,
  O,
  WhiteCheckMark,
  Diamond2,
  LargeBlueDiamond,
  LargeOrangeDiamond,
  SmallBlueDiamond,
  SmallOrangeDiamond,
  RedTriangle,
  RedTriangleDown,
  DiamondWithDot,
  RadioButton,
  WhiteSquare,
  BlackSquare,
  WhiteSquareButton,
  BlackSquareButton,
  RedSquare,
  OrangeSquare,
  YellowSquare,
  GreenSquare,
  BlueSquare,
  PurpleSquare,
  BrownSquare,
  BlackCircle,
  WhiteCircle,
  RedCircle,
  OrangleCircle,
  YellowCircle,
  GreenCircle,
  BlueCircle,
  PurpleCircle,
  BrownCircle,
  Anger,
  Boom,
  Collision,
  Dizzy2,
  Sweat,
  Dash,
  Hole,
  Bomb,
  Speech,
  LeftSpeech,
  RightSpeech,
  Anger2,
  Thought,
  Zzz,
  Wave,
  Backhand2,
  OpenHands2,
  Clap2,
  Thumbs,
  Thumbs2,
  Thumbs3,
  Thumbs4,
  Punch2,
  Punch3,
  Punch4,
  Punch5,
  Fist2,
  Fist3,
  Fist4,
  Fist5,
  Fist6,
  Raised2,
  Raised3,
  Raised4,
  Raised5,
  Raised6,
  Raised7,
  Raised8,
  Raised9,
  Raised10,
  Raised11,
  Raised12,
  Raised13,
  Raised14,
  Raised15,
  Raised16,
  Raised17,
  Raised18,
  Raised19,
  Raised20,
} from "lucide-react";
import type { Team } from "@shared/schema";

// Role configurations with modern icons and colors
const roleConfigs = {
  captain: { icon: Crown, color: "bg-fire-orange", label: "Captain" },
  igl: { icon: Brain, color: "bg-purple-500", label: "IGL" },
  entry: { icon: Zap, color: "bg-fire-red", label: "Entry" },
  support: { icon: Shield, color: "bg-fire-blue", label: "Support" },
  sniper: { icon: Crosshair, color: "bg-fire-green", label: "Sniper" },
  scout: { icon: Target, color: "bg-fire-teal", label: "Scout" },
  member: { icon: Users, color: "bg-gray-500", label: "Member" },
};

// Enhanced tournament history data
const tournamentHistory = [
  {
    id: 1,
    name: "Valorant Champions Cup",
    placement: "1st",
    kills: 47,
    prizeEarned: 15000,
    status: "Completed",
    date: "2024-01-15",
    game: "Valorant",
  },
  {
    id: 2,
    name: "BGMI Squad Battle",
    placement: "3rd",
    kills: 32,
    prizeEarned: 5000,
    status: "Completed",
    date: "2024-01-10",
    game: "BGMI",
  },
  {
    id: 3,
    name: "Free Fire Championship",
    placement: "2nd",
    kills: 28,
    prizeEarned: 8000,
    status: "Completed",
    date: "2024-01-05",
    game: "Free Fire",
  },
];

export default function Teams() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [teamCode, setTeamCode] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [filterGame, setFilterGame] = useState("all");
  const [expandedStats, setExpandedStats] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteTeamId, setInviteTeamId] = useState<number | null>(null);
  const [inviteMethod, setInviteMethod] = useState<'code' | 'search'>('code');
  const [inviteCode, setInviteCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPlayerTeamId, setSelectedPlayerTeamId] = useState<number | null>(null);

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  // Enhanced team members data with more details
  const teamMembersData: Record<number, any[]> = {
    1: [
      { 
        id: "1", 
        username: "ProGamer_X", 
        role: "captain", 
        avatar: "", 
        gameId: "PG#123", 
        contactInfo: "+91 9876543210",
        kd: 2.4,
        avgDamage: 3200,
        winRate: 78,
        status: "online",
        verified: true,
        joinDate: "2024-01-01",
        lastActive: "2 min ago"
      },
      { 
        id: "2", 
        username: "EliteSniper", 
        role: "sniper", 
        avatar: "", 
        gameId: "ES#456", 
        contactInfo: "+91 9876543211",
        kd: 3.1,
        avgDamage: 2800,
        winRate: 82,
        status: "online",
        verified: true,
        joinDate: "2024-01-02",
        lastActive: "5 min ago"
      },
      { 
        id: "3", 
        username: "SupportMaster", 
        role: "support", 
        avatar: "", 
        gameId: "SM#789", 
        contactInfo: "+91 9876543212",
        kd: 1.8,
        avgDamage: 2400,
        winRate: 75,
        status: "away",
        verified: false,
        joinDate: "2024-01-03",
        lastActive: "1 hour ago"
      },
      { 
        id: "4", 
        username: "EntryFragger", 
        role: "entry", 
        avatar: "", 
        gameId: "EF#012", 
        contactInfo: "+91 9876543213",
        kd: 2.7,
        avgDamage: 3500,
        winRate: 80,
        status: "offline",
        verified: true,
        joinDate: "2024-01-04",
        lastActive: "3 hours ago"
      },
      { 
        id: "5", 
        username: "IGLMind", 
        role: "igl", 
        avatar: "", 
        gameId: "IG#345", 
        contactInfo: "+91 9876543214",
        kd: 2.1,
        avgDamage: 2900,
        winRate: 77,
        status: "online",
        verified: true,
        joinDate: "2024-01-05",
        lastActive: "1 min ago"
      },
    ]
  };

  // Get role icon component
  const getRoleIcon = (role: string) => {
    const config = roleConfigs[role as keyof typeof roleConfigs] || roleConfigs.member;
    return config.icon;
  };

  // Get role color
  const getRoleColor = (role: string) => {
    const config = roleConfigs[role as keyof typeof roleConfigs] || roleConfigs.member;
    return config.color;
  };

  // Get role label
  const getRoleLabel = (role: string) => {
    const config = roleConfigs[role as keyof typeof roleConfigs] || roleConfigs.member;
    return config.label;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  // Enhanced Team Card Component
  const TeamCard = ({ team }: { team: Team }) => {
    const members = teamMembersData[team.id] || [];
    const isCaptain = team.captainId === user?.id;
    const onlineMembers = members.filter(m => m.status === "online").length;

    return (
      <Card className="card-hover bg-white border-l-4 border-l-fire-blue shadow-lg relative overflow-hidden group">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-fire-blue/5 to-fire-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="pb-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Enhanced team logo */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-fire-blue via-fire-red to-fire-orange rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {team.logoUrl ? (
                    <img src={team.logoUrl} alt={team.name} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <span className="text-shadow">{team.name.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                {/* Online indicator */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {onlineMembers}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <CardTitle className="text-xl font-bold fire-gray">{team.name}</CardTitle>
                  {team.verified && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      #{team.code}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(team.code)}
                      className="h-6 w-6 p-0 hover:bg-fire-blue/10"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>

                  {isCaptain && (
                    <Badge className="bg-fire-orange text-white text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      Captain
                    </Badge>
                  )}

                  <Badge variant="secondary" className="text-xs">
                    {members.length}/6 Members
                  </Badge>
                </div>
              </div>
            </div>

            {/* Team actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-fire-blue">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => {
                  setSelectedTeam(team);
                  setShowTeamDetails(true);
                }}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {isCaptain && (
                  <>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Team
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite Members
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Team Settings
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Team
                    </DropdownMenuItem>
                  </>
                )}
                {!isCaptain && (
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Leave Team
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          {/* Enhanced team stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-gradient-to-b from-fire-blue/10 to-fire-blue/5 rounded-lg">
              <div className="text-xl font-bold text-fire-blue">{team.totalMembers}</div>
              <div className="text-xs text-gray-500">Members</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-b from-fire-green/10 to-fire-green/5 rounded-lg">
              <div className="text-xl font-bold text-fire-green">{team.winRate}%</div>
              <div className="text-xs text-gray-500">Win Rate</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-b from-fire-orange/10 to-fire-orange/5 rounded-lg">
              <div className="text-xl font-bold text-fire-orange">₹{team.totalEarnings}</div>
              <div className="text-xs text-gray-500">Earnings</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-b from-fire-red/10 to-fire-red/5 rounded-lg">
              <div className="text-xl font-bold text-fire-red">{team.matchesPlayed}</div>
              <div className="text-xs text-gray-500">Matches</div>
            </div>
          </div>

          {/* Team performance trend */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Performance Trend</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+12% this month</span>
              </div>
            </div>
            <Progress value={team.winRate} className="h-2" />
          </div>

          {/* Team members preview with profile pictures */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Team Members</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">{onlineMembers} online</span>
                </div>
                {isCaptain && (
                  <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Invite
                  </Button>
                )}
              </div>
            </div>

            {/* Profile pictures grid with empty slots */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xs font-medium text-gray-600">Team Roster</span>
                <span className="text-xs text-gray-500">({members.length}/6)</span>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {/* Existing team members */}
                {members.slice(0, 6).map((member) => {
                  const RoleIcon = getRoleIcon(member.role);
                  return (
                    <div key={member.id} className="relative group">
                      <div className="relative">
                        <Avatar className="w-12 h-12 border-2 border-white shadow-md hover:shadow-lg transition-shadow">
                          <AvatarImage 
                            src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`} 
                            alt={member.username}
                          />
                          <AvatarFallback className="text-sm bg-gradient-to-br from-fire-blue to-fire-red text-white font-bold">
                            {member.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        {/* Online status indicator */}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)} shadow-sm`}></div>

                        {/* Role badge */}
                        <div className={`absolute -top-1 -left-1 w-5 h-5 ${getRoleColor(member.role)} rounded-full flex items-center justify-center shadow-sm`}>
                          <RoleIcon className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        <div className="font-medium">{member.username}</div>
                        <div className="text-gray-300">{getRoleLabel(member.role)}</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  );
                })}

                {/* Empty slots for remaining positions */}
                {Array.from({ length: 6 - members.length }).map((_, index) => (
                  <div key={`empty-${index}`} className="relative group">
                    <div 
                      className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50 hover:bg-fire-blue/5 hover:border-fire-blue/30 transition-all cursor-pointer"
                      onClick={() => {
                        if (isCaptain) {
                          setSelectedPlayerTeamId(team.id);
                          setShowPlayerModal(true);
                        }
                      }}
                    >
                      <UserPlus className="w-5 h-5 text-gray-400 group-hover:text-fire-blue transition-colors" />
                    </div>

                    {/* Invite tooltip */}
                    {isCaptain && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        <div>Add Player</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed member list (first 3) */}
            <div className="space-y-2">
              {members.slice(0, 3).map((member) => {
                const RoleIcon = getRoleIcon(member.role);
                return (
                  <div key={member.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-gray-100 hover:border-fire-blue/30 transition-colors">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage 
                          src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`} 
                          alt={member.username}
                        />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-fire-blue to-fire-red text-white">
                          {member.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 truncate">{member.username}</span>
                        {member.verified && (
                          <CheckCircle className="w-3 h-3 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{member.gameId}</span>
                        <span>•</span>
                        <span>K/D: {member.kd}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={`${getRoleColor(member.role)} text-white text-xs px-2 py-1`}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {getRoleLabel(member.role)}
                      </Badge>
                    </div>
                  </div>
                );
              })}

              {members.length > 3 && (
                <div className="text-center py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowTeamDetails(true);
                    }}
                    className="text-xs text-fire-blue hover:text-fire-blue/80"
                  >
                    View all {members.length} members
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Team actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-fire-blue hover:text-white hover:border-fire-blue"
              onClick={() => {
                setSelectedTeam(team);
                setShowTeamDetails(true);
              }}
            >
              <Users className="w-4 h-4 mr-2" />
              View Team
            </Button>

            <Button
              size="sm"
              className="bg-fire-green hover:bg-green-600 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            {isCaptain && (
              <Button
                size="sm"
                variant="outline"
                className="hover:bg-fire-orange hover:text-white hover:border-fire-orange"
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UserHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced page header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-fire-red to-fire-blue bg-clip-text text-transparent mb-2">
              My Teams
            </h1>
            <p className="text-gray-600 text-lg">
              Create and manage your esports teams for squad tournaments
            </p>
          </div>

          <div className="flex space-x-3">
            <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-fire-blue text-fire-blue hover:bg-fire-blue hover:text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Join Team
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-fire-blue" />
                    <span>Join a Team</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Team Code</label>
                    <Input
                      placeholder="Enter team code (e.g., TEAM123)"
                      value={teamCode}
                      onChange={(e) => setTeamCode(e.target.value)}
                      className="text-center font-mono text-lg"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowJoinModal(false)} 
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-fire-blue hover:bg-blue-600 text-white flex-1"
                      disabled={!teamCode}
                    >
                      Join Team
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={() => setShowCreateModal(true)}
              size="lg"
              className="bg-fire-red hover:bg-red-600 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </div>
        </div>

        {/* Enhanced quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-fire-blue to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-1">{teams.length}</div>
              <div className="text-blue-100">My Teams</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-fire-orange to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {teams.filter(t => t.captainId === user?.id).length}
              </div>
              <div className="text-orange-100">As Captain</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-fire-green to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {teams.length > 0 ? Math.round(teams.reduce((avg, team) => avg + parseFloat(team.winRate), 0) / teams.length) : 0}%
              </div>
              <div className="text-green-100">Avg Win Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-fire-red to-red-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-1">
                ₹{teams.reduce((total, team) => total + parseFloat(team.totalEarnings), 0).toFixed(2)}
              </div>
              <div className="text-red-100">Total Earnings</div>
            </CardContent>
          </Card>
        </div>

        {/* Teams grid */}
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        ) : (
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-fire-blue to-fire-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Teams Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Create your first team or join an existing one to start playing squad tournaments and building your esports legacy.
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  size="lg"
                  className="bg-fire-red hover:bg-red-600 text-white shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Team
                </Button>
                <Button 
                  onClick={() => setShowJoinModal(true)}
                  variant="outline"
                  size="lg"
                  className="border-fire-blue text-fire-blue hover:bg-fire-blue hover:text-white"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Join Team
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced team benefits section */}
        <Card className="mt-12 bg-gradient-to-r from-fire-blue/5 to-fire-red/5 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-fire-red to-fire-blue bg-clip-text text-transparent">
              Team Benefits & Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-white/80 transition-all border border-white/30">
                <div className="w-16 h-16 bg-gradient-to-br from-fire-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-800">Squad Tournaments</h4>
                <p className="text-sm text-gray-600">
                  Participate in team-based tournaments with higher prize pools and exclusive rewards
                </p>
              </div>

              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-white/80 transition-all border border-white/30">
                <div className="w-16 h-16 bg-gradient-to-br from-fire-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-800">Shared Rewards</h4>
                <p className="text-sm text-gray-600">
                  Win together and automatically distribute prize money among teammates
                </p>
              </div>

              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-white/80 transition-all border border-white/30">
                <div className="w-16 h-16 bg-gradient-to-br from-fire-orange to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-800">Team Analytics</h4>
                <p className="text-sm text-gray-600">
                  Advanced performance tracking and team statistics with detailed insights
                </p>
              </div>

              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-white/80 transition-all border border-white/30">
                <div className="w-16 h-16 bg-gradient-to-br from-fire-red to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-800">Leadership</h4>
                <p className="text-sm text-gray-600">
                  Develop leadership skills by managing and growing your esports team
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced team details modal */}
        <Dialog open={showTeamDetails} onOpenChange={setShowTeamDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedTeam && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-fire-blue to-fire-red rounded-lg flex items-center justify-center text-white font-bold">
                      {selectedTeam.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xl">{selectedTeam.name}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">#{selectedTeam.code}</Badge>
                        {selectedTeam.verified && (
                          <Badge className="bg-blue-100 text-blue-700">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-8">
                  {/* Team info and sharing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Team Code</label>
                        <div className="flex items-center space-x-2">
                          <code className="p-3 bg-gray-100 rounded-lg text-lg font-mono flex-1 text-center">
                            #{selectedTeam.code}
                          </code>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => navigator.clipboard.writeText(selectedTeam.code)}
                            className="hover:bg-fire-blue hover:text-white"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Share Team</label>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <QrCode className="w-4 h-4 mr-2" />
                            QR Code
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            WhatsApp
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Link className="w-4 h-4 mr-2" />
                            Copy Link
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Created</label>
                        <div className="text-gray-600 flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(selectedTeam.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Last Active</label>
                        <div className="text-gray-600 flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>2 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced team stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-fire-blue/10 to-fire-blue/5 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-fire-blue">{selectedTeam.totalMembers}</div>
                      <div className="text-sm text-gray-600">Members</div>
                    </div>
                    <div className="bg-gradient-to-br from-fire-green/10 to-fire-green/5 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-fire-green">{selectedTeam.winRate}%</div>
                      <div className="text-sm text-gray-600">Win Rate</div>
                    </div>
                    <div className="bg-gradient-to-br from-fire-orange/10 to-fire-orange/5 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-fire-orange">₹{selectedTeam.totalEarnings}</div>
                      <div className="text-sm text-gray-600">Earnings</div>
                    </div>
                    <div className="bg-gradient-to-br from-fire-red/10 to-fire-red/5 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-fire-red">{selectedTeam.matchesPlayed}</div>
                      <div className="text-sm text-gray-600">Matches</div>
                    </div>
                  </div>

                  {/* Enhanced members list */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-800">Team Members</h4>
                      <Button size="sm" className="bg-fire-blue hover:bg-blue-600 text-white">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Member
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {(teamMembersData[selectedTeam.id] || []).map((member) => {
                        const RoleIcon = getRoleIcon(member.role);
                        return (
                          <div key={member.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-fire-blue/30 transition-colors">
                            <div className="relative">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-fire-blue to-fire-red text-white font-bold">
                                  {member.username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h5 className="font-semibold text-gray-800">{member.username}</h5>
                                {member.verified && (
                                  <CheckCircle className="w-4 h-4 text-blue-500" />
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span>Game ID: {member.gameId}</span>
                                <span>K/D: {member.kd}</span>
                                <span>Avg DMG: {member.avgDamage}</span>
                                <span>Win Rate: {member.winRate}%</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Joined: {new Date(member.joinDate).toLocaleDateString()} • Last active: {member.lastActive}
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <Badge className={`${getRoleColor(member.role)} text-white`}>
                                <RoleIcon className="w-3 h-3 mr-1" />
                                {getRoleLabel(member.role)}
                              </Badge>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Message
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Role
                                  </DropdownMenuItem>
                                  <Separator />
                                  <DropdownMenuItem className="text-red-600">
                                    <UserX className="w-4 h-4 mr-2" />
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tournament history */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-800">Tournament History</h4>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4 mr-2" />
                          Filter
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tournament</TableHead>
                            <TableHead>Game</TableHead>
                            <TableHead>Placement</TableHead>
                            <TableHead>Kills</TableHead>
                            <TableHead>Prize</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tournamentHistory.map((tournament) => (
                            <TableRow key={tournament.id}>
                              <TableCell className="font-medium">{tournament.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{tournament.game}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  tournament.placement === "1st" ? "bg-yellow-500 text-white" :
                                  tournament.placement === "2nd" ? "bg-gray-400 text-white" :
                                  tournament.placement === "3rd" ? "bg-orange-400 text-white" :
                                  "bg-gray-200 text-gray-800"
                                }>
                                  {tournament.placement}
                                </Badge>
                              </TableCell>
                              <TableCell>{tournament.kills}</TableCell>
                              <TableCell className="text-green-600 font-semibold">
                                ₹{tournament.prizeEarned.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge variant={tournament.status === "Completed" ? "default" : "secondary"}>
                                  {tournament.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(tournament.date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Team actions */}
                  <div className="flex justify-between items-center pt-6 border-t">
                    <div className="flex space-x-2">
                      <Button className="bg-fire-blue hover:bg-blue-600 text-white">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Team
                      </Button>
                      <Button variant="outline">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite Members
                      </Button>
                      <Button variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Team
                      </Button>
                    </div>

                    <Button variant="outline" onClick={() => setShowTeamDetails(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Team Modal */}
        <TeamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />

        {/* Add Player Modal */}
        <PlayerModal
          isOpen={showPlayerModal}
          onClose={() => {
            setShowPlayerModal(false);
            setSelectedPlayerTeamId(null);
          }}
          teamId={selectedPlayerTeamId || undefined}
          mode="add"
        />

        {/* Invite Player Modal */}
        <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-fire-blue" />
                <span>Invite Player to Team</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Invite Method Selection */}
              <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setInviteMethod('code')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    inviteMethod === 'code' 
                      ? 'bg-white text-fire-blue shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <QrCode className="w-4 h-4 mr-2 inline" />
                  Share Code
                </button>
                <button
                  onClick={() => setInviteMethod('search')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    inviteMethod === 'search' 
                      ? 'bg-white text-fire-blue shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Search className="w-4 h-4 mr-2 inline" />
                  Search User
                </button>
              </div>

              {/* Share Code Method */}
              {inviteMethod === 'code' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Team Invite Code
                    </label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center font-mono text-lg font-bold text-fire-blue">
                        #{teams.find(t => t.id === inviteTeamId)?.code}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const code = teams.find(t => t.id === inviteTeamId)?.code;
                          if (code) {
                            navigator.clipboard.writeText(code);
                          }
                        }}
                        className="hover:bg-fire-blue hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Share this code with players to let them join your team
                    </p>
                  </div>

                  {/* Share Options */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const code = teams.find(t => t.id === inviteTeamId)?.code;
                        const teamName = teams.find(t => t.id === inviteTeamId)?.name;
                        const text = `Join my FireFight team "${teamName}" with code: ${code}`;
                        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                      }}
                      className="flex-1"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const code = teams.find(t => t.id === inviteTeamId)?.code;
                        const teamName = teams.find(t => t.id === inviteTeamId)?.name;
                        const text = `Join my FireFight team "${teamName}" with code: ${code}`;
                        navigator.clipboard.writeText(text);
                      }}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <QrCode className="w-4 h-4 mr-1" />
                      QR Code
                    </Button>
                  </div>
                </div>
              )}

              {/* Search User Method */}
              {inviteMethod === 'search' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Search Player
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by username or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Search Results */}
                  {searchQuery && (
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="text-sm text-gray-500 mb-2">Search Results:</div>
                      <div className="space-y-2">
                        {/* Sample search results */}
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="" />
                              <AvatarFallback className="text-xs bg-fire-blue text-white">
                                U
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">Username123</span>
                          </div>
                          <Button size="sm" className="bg-fire-blue hover:bg-blue-600 text-white">
                            <UserPlus className="w-3 h-3 mr-1" />
                            Invite
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Team Info */}
              <div className="bg-fire-blue/5 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-fire-blue to-fire-red rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {teams.find(t => t.id === inviteTeamId)?.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {teams.find(t => t.id === inviteTeamId)?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {teamMembersData[inviteTeamId || 0]?.length || 0}/6 members
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteTeamId(null);
                    setSearchQuery('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Handle invite action based on method
                    if (inviteMethod === 'code') {
                      // Code sharing is handled by the share buttons
                      setShowInviteModal(false);
                    } else {
                      // Handle direct invite
                      console.log('Send invite to:', searchQuery);
                      setShowInviteModal(false);
                    }
                    setInviteTeamId(null);
                    setSearchQuery('');
                  }}
                  className="flex-1 bg-fire-blue hover:bg-blue-600 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {inviteMethod === 'code' ? 'Done' : 'Send Invite'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}