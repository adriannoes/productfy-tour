# 🎯 TourFlow - Interactive Tour Builder

**TourFlow** is a complete SaaS platform for creating and managing interactive guided tours on any website. Create onboarding flows, feature walkthroughs, and user guides with an intuitive visual editor.

## 🚀 Features

### Admin Dashboard
- **Visual Tour Editor**: Create tours with drag-and-drop simplicity
- **Step Management**: Add, edit, and reorder tour steps
- **Live Preview**: Test tours before publishing
- **Analytics Dashboard**: Track views, completions, and engagement
- **Integration Code**: One-click copy-paste widget integration

### Interactive Widget
- **Smart Highlighting**: Automatically spotlight target elements
- **Smooth Animations**: Beautiful fade and scale effects
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Persistence**: Remember completed tours via localStorage
- **Customizable Placement**: Top, bottom, left, right positioning
- **Progress Indicators**: Visual dots showing tour progress

### Analytics & Tracking
- **Real-time Metrics**: Views, completions, skip rate
- **Step-by-Step Analysis**: See where users drop off
- **Completion Rate**: Track tour effectiveness
- **User Behavior**: Anonymous tracking with unique identifiers

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **Charts**: Recharts
- **State Management**: TanStack Query (React Query)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Setup

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Supabase**

The project is already connected to Supabase. Check `src/integrations/supabase/client.ts` for credentials.

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 🎨 How to Use

### 1. Create an Account
- Access the dashboard at `/`
- Sign up with email and password
- Confirm your email (check spam folder)

### 2. Create Your First Tour

1. Click **"+ New Tour"**
2. Enter a tour name
3. Add steps:
   - **Title**: Step heading
   - **Content**: Description text
   - **Target**: CSS selector (e.g., `#my-button`, `.header`)
   - **Placement**: Where tooltip appears (top/bottom/left/right)
4. Click **"Save Tour"**

### 3. Preview Your Tour

1. Select a tour from the list
2. Click **"Preview"** in the header
3. Test navigation and interactions
4. Verify element highlighting

### 4. Integrate into Your Website

1. Click **"Código"** (Integration Code)
2. Copy the generated code snippet
3. Paste into your website's HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://your-domain.lovableproject.com/widget.js"></script>
  <link rel="stylesheet" href="https://your-domain.lovableproject.com/widget.css">
</head>
<body>
  <!-- Your content -->
  
  <script>
    TourFlow.init({
      tourId: 'your-tour-id',
      autoStart: true,
      onComplete: () => console.log('Tour completed!'),
    });
  </script>
</body>
</html>
```

### 5. Track Performance

1. Select a tour
2. Click **"Analytics"** (BarChart icon)
3. View metrics:
   - Total views
   - Completions
   - Skip rate
   - Step-by-step breakdown

## ⚙️ Widget Configuration

### Basic Initialization

```javascript
TourFlow.init({
  tourId: 'your-tour-id',           // Required: Tour ID from dashboard
  autoStart: true,                   // Start tour automatically
  overlay: true,                     // Show dark overlay
  highlightPadding: 10,              // Padding around highlighted element
  scrollBehavior: 'smooth',          // Scroll animation
  onComplete: () => {},              // Callback when tour completes
  onSkip: (currentStep) => {},       // Callback when tour is skipped
  onStepChange: (step, index) => {}, // Callback on each step
});
```

### Manual Control

```javascript
// Start tour manually
TourFlow.start();

// Stop tour
TourFlow.stop();

// Go to specific step
TourFlow.goToStep(2);

// Navigate
TourFlow.next();
TourFlow.previous();

// Reset completion status
TourFlow.reset();

// Destroy widget
TourFlow.destroy();
```

## 🧪 Testing

Use the included test page at `public/test.html`:

1. Open in browser
2. Click "Start Tour"
3. Test all controls:
   - Next/Back navigation
   - Skip/Done buttons
   - LocalStorage persistence
   - Analytics tracking

## 🗃️ Database Schema

### Tables

**tours**
- `id` (uuid, PK)
- `name` (text)
- `user_id` (uuid, FK)
- `is_active` (boolean)
- `created_at`, `updated_at` (timestamps)

**tour_steps**
- `id` (uuid, PK)
- `tour_id` (uuid, FK)
- `title`, `content` (text)
- `target` (CSS selector)
- `placement` (top/bottom/left/right)
- `step_order` (integer)

**tour_analytics**
- `id` (uuid, PK)
- `tour_id` (uuid, FK)
- `event_type` (view/step_view/complete/skip)
- `step_index` (integer)
- `user_identifier` (text)
- `metadata` (jsonb)
- `created_at` (timestamp)

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- **Authenticated access** for tour management
- **Anonymous tracking** for public widgets
- **Secure Edge Functions** for API endpoints

## 🚀 Deployment

### Via Lovable (Recommended)

1. Open [Lovable Dashboard](https://lovable.dev/projects/ff4d65f2-9554-4c27-8dbb-c9f97c42e776)
2. Click **Share → Publish**
3. Your app is live!

### Custom Domain

1. Navigate to Project > Settings > Domains
2. Click "Connect Domain"
3. Follow DNS configuration steps

## 🐛 Troubleshooting

### Widget not appearing
- Check if `tourId` is correct
- Verify tour is active (`is_active = true`)
- Open DevTools Console for errors

### Elements not highlighting
- Verify CSS selector is correct
- Element must exist in DOM when tour starts
- Try `document.querySelector('your-selector')` in console

### Analytics not tracking
- Check Network tab for `/track-event` calls
- Verify Supabase Edge Function is deployed
- Check `tour_analytics` table in Supabase

### Authentication issues
- Confirm email (check spam)
- Verify Supabase credentials
- Check browser console for errors

## 📚 API Reference

### Edge Functions

**GET `/get-tour?tourId={id}`**
- Returns active tour data with steps
- Public endpoint (no auth required)

**POST `/track-event`**
- Logs analytics events
- Body: `{ tourId, eventType, stepIndex, userIdentifier, metadata }`

## 🤝 Contributing

This is a Lovable-generated project. To contribute:

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Push and create a Pull Request
5. Changes will sync with Lovable

## 📄 License

This project is available for personal and commercial use.

## 🔗 Links

- **Project URL**: https://lovable.dev/projects/ff4d65f2-9554-4c27-8dbb-c9f97c42e776
- **Documentation**: https://docs.lovable.dev
- **Supabase Dashboard**: https://supabase.com/dashboard

## 💡 Tips

- **Keep tours short**: 3-5 steps is ideal
- **Test on real content**: Use actual page elements
- **Mobile-first**: Test on different screen sizes
- **Clear CTAs**: Make next actions obvious
- **Track metrics**: Use analytics to improve tours

---

Made with ❤️ using [Lovable](https://lovable.dev)
